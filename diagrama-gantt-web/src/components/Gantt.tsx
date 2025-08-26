import { FC, useRef, useState, useMemo } from 'react';
import type { Task } from '../types';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface GanttProps {
  tasks: Task[];
}

const ROW_HEIGHT: number = 40;

// Componente para la Tabla de Tareas (Grid Izquierdo)
const TaskGrid: FC<{ tasksToRender: any[], toggleTask: (id: number) => void }> = ({ tasksToRender, toggleTask }) => {
  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="border-r border-gray-200 bg-white">
      {/* Encabezado de la tabla */}
      <div className="flex bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 z-20">
        <div className="w-48 p-3 border-r border-gray-200">Nombre</div>
        <div className="w-24 p-3 border-r border-gray-200">Inicio</div>
        <div className="w-24 p-3">Fin</div>
      </div>
      {/* Filas de tareas */}
      <div className="relative">
        {tasksToRender.map(task => (
          <div key={task.id} className="flex border-b border-gray-200 text-sm items-center text-gray-700" style={{ height: `${ROW_HEIGHT}px` }}>
            <div 
              className="w-48 p-2 truncate flex-shrink-0 flex items-center border-r border-gray-200"
              style={{ paddingLeft: `${(task.level || 0) * 20 + 8}px` }}
            >
              {task.type === 'group' && (
                <button onClick={() => toggleTask(task.id)} className="mr-1 p-0.5 rounded hover:bg-gray-200">
                  {task.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              )}
              <span className="truncate">{task.name}</span>
            </div>
            <div className="w-24 p-2 flex-shrink-0 border-r border-gray-200 text-xs">{formatDate(task.startDate)}</div>
            <div className="w-24 p-2 flex-shrink-0 text-xs">{formatDate(task.endDate)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para la Línea de Tiempo (Diagrama Derecho)
const Timeline: FC<{ tasksToRender: any[] }> = ({ tasksToRender }) => {
  const dayWidth = 40;

  const projectStart = new Date(Math.min(...tasksToRender.map(t => new Date(t.startDate).getTime())));
  const projectEnd = new Date(Math.max(...tasksToRender.map(t => new Date(t.endDate).getTime())));

  projectStart.setUTCHours(0, 0, 0, 0);
  projectEnd.setUTCHours(0, 0, 0, 0);

  const days = [];
  let currentDate = new Date(projectStart);
  while (currentDate <= projectEnd) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const getDaysDiff = (start: Date, end: Date) => {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  };

  // Componente para dibujar las líneas de dependencia
  const DependencyLines: FC<{ tasksToRender: any[] }> = ({ tasksToRender }) => {
    const taskMap = new Map(tasksToRender.map((task, index) => [task.id, { ...task, index }]));
    const lines = [];

    for (const task of tasksToRender) {
      if (task.dependencies && task.dependencies.length > 0) {
        for (const depId of task.dependencies) {
          const sourceTask = taskMap.get(depId);
          const targetTask = task;

          if (sourceTask) {
            const sourceEndDate = new Date(sourceTask.endDate);
            sourceEndDate.setUTCHours(0, 0, 0, 0);
            const targetStartDate = new Date(targetTask.startDate);
            targetStartDate.setUTCHours(0, 0, 0, 0);

            const sourceX = getDaysDiff(projectStart, sourceEndDate) * dayWidth;
            const sourceY = sourceTask.index * ROW_HEIGHT + ROW_HEIGHT / 2;
            const targetX = getDaysDiff(projectStart, targetStartDate) * dayWidth;
            const targetY = targetTask.index * ROW_HEIGHT + ROW_HEIGHT / 2;

            lines.push(
              <path
                key={`${depId}-${targetTask.id}`}
                d={`M ${sourceX} ${sourceY} L ${targetX - 15} ${sourceY} L ${targetX - 15} ${targetY} L ${targetX} ${targetY}`}
                stroke="#9CA3AF"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#arrow)"
              />
            );
          }
        }
      }
    }

    return (
      <svg className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#9CA3AF" />
          </marker>
        </defs>
        {lines}
      </svg>
    );
  };

  return (
    <div className="relative w-full">
      {/* Encabezado de la línea de tiempo */}
      <div className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
        {days.map(day => (
          <div key={day.toISOString()} className="flex-shrink-0 text-center border-r border-gray-200" style={{ width: `${dayWidth}px` }}>
            <div className="text-xs text-gray-400 pt-1">{day.toLocaleDateString('es-ES', { weekday: 'short' })}</div>
            <div className="text-sm font-semibold text-gray-600 pb-1">{day.getDate()}</div>
          </div>
        ))}
      </div>

      {/* Contenido de la línea de tiempo (Barras y dependencias) */}
      <div className="relative" style={{ width: `${days.length * dayWidth}px`, height: `${tasksToRender.length * ROW_HEIGHT}px` }}>
        {/* Filas de fondo para la grilla */}
        {tasksToRender.map((_, index) => (
          <div key={index} className="absolute w-full border-b border-gray-200" style={{ top: `${(index + 1) * ROW_HEIGHT}px`, height: '0' }}></div>
        ))}

        {tasksToRender.map((task, index) => {
          const taskStart = new Date(task.startDate);
          taskStart.setUTCHours(0, 0, 0, 0);

          const offset = getDaysDiff(projectStart, taskStart) * dayWidth;
          const width = Math.max(task.duration, 0) * dayWidth;

          const containerStyle: React.CSSProperties = {
            top: `${index * ROW_HEIGHT}px`,
            left: `${offset}px`,
            height: `${ROW_HEIGHT}px`
          };

          const BarContainer: FC<{ children: React.ReactNode }> = ({ children }) => (
            <div className="absolute flex items-center" style={containerStyle}>
              {children}
            </div>
          );

          if (task.type === 'milestone') {
            return (
              <BarContainer key={task.id}>
                <div 
                  className="bg-yellow-400 border border-yellow-600 transform rotate-45 shadow-sm"
                  style={{ width: '18px', height: '18px', marginLeft: '1px' }}
                  title={`${task.name} (Hito)`}
                />
              </BarContainer>
            );
          }

          const isGroup = task.type === 'group';
          const barColor = isGroup ? 'bg-green-400 border-green-600' : 'bg-blue-400 border-blue-600';
          const progressColor = isGroup ? 'bg-green-600' : 'bg-blue-600';

          return (
            <BarContainer key={task.id}>
              <div 
                className={`absolute ${barColor} h-6 rounded border shadow-sm flex items-center`}
                style={{ width: `${width}px` }}
              >
                <div 
                  className={`${progressColor} h-full rounded-l`}
                  style={{ width: `${task.progress}%` }}
                />
                <div className="absolute left-2 right-2 text-white text-xs font-semibold truncate" title={task.name}>
                  {task.name}
                </div>
              </div>
            </BarContainer>
          );
        })}
        <DependencyLines tasksToRender={tasksToRender} />
      </div>
    </div>
  );
};

// Componente Principal del Gantt
const GanttComponent: FC<GanttProps> = ({ tasks: initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const gridRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (gridRef.current && timelineRef.current) {
      gridRef.current.scrollTop = event.currentTarget.scrollTop;
      timelineRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t));
  };

  const tasksToRender = useMemo(() => {
    const taskMap = new Map(tasks.map(t => [t.id, { ...t, children: [] as Task[] }]));
    const tree: any[] = [];

    for (const task of tasks) {
      if (task.parentId && taskMap.has(task.parentId)) {
        taskMap.get(task.parentId)?.children.push(taskMap.get(task.id)!);
      } else {
        tree.push(taskMap.get(task.id)!);
      }
    }

    const flatList: any[] = [];
    const traverse = (node: any, level: number) => {
      flatList.push({ ...node, level });
      if (node.expanded && node.children) {
        for (const child of node.children.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())) {
          traverse(child, level + 1);
        }
      }
    };

    tree.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).forEach(node => traverse(node, 0));
    return flatList;
  }, [tasks]);

  if (!tasksToRender || tasksToRender.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">No hay tareas para mostrar.</div>;
  }

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <div className="w-96 flex-shrink-0 border-r border-gray-200 overflow-y-hidden bg-white" ref={gridRef}>
        <TaskGrid tasksToRender={tasksToRender} toggleTask={toggleTask} />
      </div>
      <div className="flex-1 overflow-auto" ref={timelineRef} onScroll={handleScroll}>
        <Timeline tasksToRender={tasksToRender} />
      </div>
    </div>
  );
};

export default GanttComponent;
