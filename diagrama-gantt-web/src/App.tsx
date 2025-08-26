import { useState, useEffect } from 'react';
import type { FC } from 'react';
import Gantt from './components/Gantt';
import type { 
  Project, 
  Task, 
  Resource, 
  Priority, 
  Status 
} from './types';
import { 
  Calendar, 
  Plus, 
  Save, 
  Download, 
  Settings, 
  Users, 
  Clock, 
  BarChart3, 
  FileText, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  User,
  DollarSign,
  Target,
  Activity,
  Paperclip,
  Bell,
  ChevronLeft,
  MoreHorizontal,
  Layers,
  GitBranch,
  X
} from 'lucide-react';

const ProjectManagementApp: FC = () => {
  // Estados principales
  const [activeView, setActiveView] = useState('gantt');
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState<'project' | 'task' | 'resource' | null>(null);
  const [timeScale, setTimeScale] = useState('days');
  const [zoom, setZoom] = useState(100);
  
  // Estados para formularios
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: 0,
    priority: 'medium' as Priority,
    status: 'planning' as Status
  });

  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    duration: 1,
    startDate: '',
    endDate: '',
    priority: 'medium' as Priority,
    status: 'not-started' as Status,
    assignedTo: '',
    progress: 0,
    dependencies: [] as number[],
    type: 'task' as 'task' | 'group' | 'milestone',
    cost: 0,
    effort: 0
  });

  const [newResource, setNewResource] = useState({
    name: '',
    email: '',
    role: '',
    cost: 0,
    availability: 100,
    skills: [] as string[]
  });

  // Datos iniciales
  useEffect(() => {
    const initialProjects: Project[] = [
      {
        id: 1,
        name: 'Desarrollo Web Corporativo',
        description: 'Proyecto de desarrollo completo del sitio web corporativo',
        startDate: '2025-08-15',
        endDate: '2025-12-15',
        budget: 50000,
        priority: 'high',
        status: 'in-progress',
        progress: 45
      }
    ];

    const initialTasks: Task[] = [
      {
        id: 1,
        projectId: 1,
        name: 'Fase 1: Planificación y Diseño',
        description: 'Planificación inicial y diseño de la arquitectura y UI/UX.',
        duration: 13,
        startDate: '2025-08-15',
        endDate: '2025-08-29',
        priority: 'high',
        status: 'in-progress',
        assignedTo: '',
        progress: 50,
        dependencies: [],
        type: 'group',
        cost: 6500,
        effort: 104,
        expanded: true,
        parentId: null
      },
      {
        id: 2,
        projectId: 1,
        name: 'Análisis de Requerimientos',
        description: 'Análisis completo de los requerimientos del proyecto',
        duration: 5,
        startDate: '2025-08-15',
        endDate: '2025-08-20',
        priority: 'high',
        status: 'completed',
        assignedTo: 'Juan Pérez',
        progress: 100,
        dependencies: [],
        type: 'task',
        cost: 2500,
        effort: 40,
        expanded: true,
        parentId: 1
      },
      {
        id: 3,
        projectId: 1,
        name: 'Diseño UI/UX',
        description: 'Diseño de interfaces y experiencia de usuario',
        duration: 8,
        startDate: '2025-08-21',
        endDate: '2025-08-29',
        priority: 'high',
        status: 'in-progress',
        assignedTo: 'María García',
        progress: 75,
        dependencies: [2],
        type: 'task',
        cost: 4000,
        effort: 64,
        expanded: true,
        parentId: 1
      },
      {
        id: 4,
        projectId: 1,
        name: 'Hito: Diseño Aprobado',
        description: 'El diseño de UI/UX ha sido aprobado por el cliente.',
        duration: 0,
        startDate: '2025-08-29',
        endDate: '2025-08-29',
        priority: 'high',
        status: 'completed',
        assignedTo: 'María García',
        progress: 100,
        dependencies: [3],
        type: 'milestone',
        cost: 0,
        effort: 0,
        expanded: true,
        parentId: 1
      },
      {
        id: 5,
        projectId: 1,
        name: 'Fase 2: Desarrollo',
        description: 'Fase de desarrollo y implementación de funcionalidades.',
        duration: 15,
        startDate: '2025-08-30',
        endDate: '2025-09-18',
        priority: 'medium',
        status: 'not-started',
        assignedTo: '',
        progress: 0,
        dependencies: [4],
        type: 'group',
        cost: 7500,
        effort: 120,
        expanded: false,
        parentId: null
      },
      {
        id: 6,
        projectId: 1,
        name: 'Desarrollo Frontend',
        description: 'Implementación del frontend de la aplicación',
        duration: 15,
        startDate: '2025-08-30',
        endDate: '2025-09-18',
        priority: 'medium',
        status: 'not-started',
        assignedTo: 'Carlos López',
        progress: 0,
        dependencies: [3],
        type: 'task',
        cost: 7500,
        effort: 120,
        expanded: false,
        parentId: 5
      }
    ];

    const initialResources: Resource[] = [
      {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan.perez@empresa.com',
        role: 'Analista Senior',
        cost: 80,
        availability: 100,
        skills: ['Análisis', 'Documentación', 'UML']
      },
      {
        id: 2,
        name: 'María García',
        email: 'maria.garcia@empresa.com',
        role: 'Diseñadora UI/UX',
        cost: 75,
        availability: 90,
        skills: ['Figma', 'Adobe XD', 'Prototipado']
      },
      {
        id: 3,
        name: 'Carlos López',
        email: 'carlos.lopez@empresa.com',
        role: 'Desarrollador Frontend',
        cost: 70,
        availability: 100,
        skills: ['React', 'JavaScript', 'CSS', 'HTML']
      }
    ];

    setProjects(initialProjects);
    setCurrentProject(initialProjects[0]);
    setTasks(initialTasks);
    setResources(initialResources);
  }, []);

  // Funciones utilitarias
  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateProgress = (projectId: number) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const totalProgress = projectTasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / projectTasks.length);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'not-started': return 'text-gray-600 bg-gray-50';
      case 'delayed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Funciones CRUD
  const addProject = () => {
    if (!newProject.name) return;
    
    const project: Project = {
      ...newProject,
      id: Date.now(),
      progress: 0
    };
    
    setProjects([...projects, project]);
    setCurrentProject(project);
    setNewProject({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: 0,
      priority: 'medium',
      status: 'planning'
    });
    setShowModal(null);
  };

  const addTask = () => {
    if (!newTask.name || !currentProject) return;
    
    const task: Task = {
      ...newTask,
      id: Date.now(),
      projectId: currentProject.id,
      expanded: true,
      parentId: null
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      name: '',
      description: '',
      duration: 1,
      startDate: '',
      endDate: '',
      priority: 'medium',
      status: 'not-started',
      assignedTo: '',
      progress: 0,
      dependencies: [],
      type: 'task',
      cost: 0,
      effort: 0
    });
    setShowModal(null);
  };

  const addResource = () => {
    if (!newResource.name) return;
    
    const resource: Resource = {
      ...newResource,
      id: Date.now()
    };
    
    setResources([...resources, resource]);
    setNewResource({
      name: '',
      email: '',
      role: '',
      cost: 0,
      availability: 100,
      skills: []
    });
    setShowModal(null);
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setSelectedTasks(prev => prev.filter(id => id !== taskId));
  };

  const updateTaskProgress = (taskId: number, progress: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, progress } : task
    ));
  };

  // Componente de la barra lateral
  const Sidebar: FC = () => (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-80'} min-h-screen`}>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold">Project Manager Pro</h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-700"
          >
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
      </div>

      {!sidebarCollapsed && (
        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase">Proyectos</h3>
              <button
                onClick={() => setShowModal('project')}
                className="p-1 rounded hover:bg-gray-700"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {projects.map(project => (
                <div
                  key={project.id}
                  onClick={() => setCurrentProject(project)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${currentProject?.id === project.id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{project.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progreso</span>
                      <span>{calculateProgress(project.id)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(project.id)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3">Vistas</h3>
            <div className="space-y-1">
              {[
                { id: 'gantt', name: 'Diagrama de Gantt', icon: BarChart3 },
                { id: 'kanban', name: 'Tablero Kanban', icon: Layers },
                { id: 'calendar', name: 'Vista de Calendario', icon: Calendar },
                { id: 'resources', name: 'Recursos', icon: Users },
                { id: 'reports', name: 'Reportes', icon: FileText },
                { id: 'timeline', name: 'Línea de Tiempo', icon: GitBranch }
              ].map(view => {
                const IconComponent = view.icon;
                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${activeView === view.id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
                    <IconComponent size={18} />
                    <span>{view.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Componente del encabezado
  const Header: FC = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentProject ? currentProject.name : 'Selecciona un proyecto'}
          </h2>
          {currentProject && (
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(currentProject.status)}`}>
              {currentProject.status}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowModal('task')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Nueva Tarea</span>
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Save size={20} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Download size={20} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  // Vista de Diagrama de Gantt
  const GanttView: FC = () => {
    const projectTasks = tasks.filter(t => t.projectId === currentProject?.id);
    return (
      <div className="flex-1 overflow-hidden">
        <Gantt tasks={projectTasks} />
      </div>
    );
  };

  // Vista de Tablero Kanban
  const KanbanView: FC = () => {
    const columns = [
      { id: 'not-started', title: 'Por Hacer', color: 'bg-gray-100' },
      { id: 'in-progress', title: 'En Progreso', color: 'bg-blue-100' },
      { id: 'completed', title: 'Completado', color: 'bg-green-100' }
    ];

    const projectTasks = tasks.filter(t => t.projectId === currentProject?.id);

    return (
      <div className="flex space-x-6 p-6 overflow-x-auto h-full">
        {columns.map(column => (
          <div key={column.id} className={`flex-shrink-0 w-80 ${column.color} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{column.title}</h3>
              <span className="bg-white rounded-full px-2 py-1 text-sm font-medium">
                {projectTasks.filter(t => t.status === column.id).length}
              </span>
            </div>
            <div className="space-y-3">
              {projectTasks
                .filter(task => task.status === column.id)
                .map(task => (
                  <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border" onClick={() => setSelectedTasks([task.id])}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{task.name}</h4>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <div className="flex items-center space-x-2">
                        {task.assignedTo && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                            {task.assignedTo.charAt(0)}
                          </div>
                        )}
                        <span className="text-xs text-gray-500">{formatDate(task.endDate)}</span>
                      </div>
                    </div>
                    {task.progress > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progreso</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Vista de Calendario
  const CalendarView: FC = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | string)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push('');
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const projectTasks = tasks.filter(t => t.projectId === currentProject?.id);

    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-semibold">
              {today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronLeft size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="bg-gray-50 p-3 text-center font-semibold text-gray-600">
                {day}
              </div>
            ))}
            
            {days.map((day, index) => (
              <div key={index} className="bg-white p-2 h-32 overflow-hidden">
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-2 ${day === today.getDate() ? 'text-blue-600' : 'text-gray-900'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {projectTasks
                        .filter(task => {
                          const taskDate = new Date(task.startDate);
                          return taskDate.getDate() + 1 === day && 
                                 taskDate.getMonth() === today.getMonth() &&
                                 taskDate.getFullYear() === today.getFullYear();
                        })
                        .slice(0, 2)
                        .map(task => (
                          <div key={task.id} className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate">
                            {task.name}
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Vista de Recursos
  const ResourcesView: FC = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Gestión de Recursos</h3>
        <button
          onClick={() => setShowModal('resource')}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          <span>Agregar Recurso</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recurso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponibilidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Habilidades</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map(resource => (
                <tr key={resource.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {resource.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                        <div className="text-sm text-gray-500">{resource.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{resource.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${resource.cost}/h</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${resource.availability}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-900">{resource.availability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {resource.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">{skill}</span>
                      ))}
                      {resource.skills.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">+{resource.skills.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900"><Edit size={16} /></button>
                      <button className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-semibold mb-4">Utilización de Recursos</h4>
        <div className="space-y-4">
          {resources.map(resource => {
            const assignedTasks = tasks.filter(t => t.assignedTo === resource.name && t.status !== 'completed');
            const utilization = Math.min((assignedTasks.length * 20), 100);
            
            return (
              <div key={resource.id} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium">{resource.name}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${utilization > 80 ? 'bg-red-500' : utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${utilization}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 w-16">{utilization}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Vista de Reportes
  const ReportsView: FC = () => {
    if (!currentProject) return null;
    const projectTasks = tasks.filter(t => t.projectId === currentProject.id);
    if (projectTasks.length === 0) return <div className="p-6 text-center text-gray-500">No hay tareas para generar reportes.</div>;

    const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = projectTasks.filter(t => t.status === 'in-progress').length;
    const notStartedTasks = projectTasks.filter(t => t.status === 'not-started').length;
    const totalCost = projectTasks.reduce((sum, task) => sum + task.cost, 0);
    const totalEffort = projectTasks.reduce((sum, task) => sum + task.effort, 0);

    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100"><Target className="h-6 w-6 text-blue-600" /></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tareas</p>
                <p className="text-2xl font-semibold text-gray-900">{projectTasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100"><CheckCircle className="h-6 w-6 text-green-600" /></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-semibold text-gray-900">{completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100"><DollarSign className="h-6 w-6 text-yellow-600" /></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Costo Total</p>
                <p className="text-2xl font-semibold text-gray-900">${totalCost.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100"><Clock className="h-6 w-6 text-purple-600" /></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Esfuerzo Total</p>
                <p className="text-2xl font-semibold text-gray-900">{totalEffort}h</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold mb-4">Estado de las Tareas</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Completadas</span>
                <span className="text-sm text-gray-900">{completedTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(completedTasks / projectTasks.length) * 100}%` }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">En Progreso</span>
                <span className="text-sm text-gray-900">{inProgressTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(inProgressTasks / projectTasks.length) * 100}%` }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Por Hacer</span>
                <span className="text-sm text-gray-900">{notStartedTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-400 h-2 rounded-full" style={{ width: `${(notStartedTasks / projectTasks.length) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold mb-4">Distribución por Prioridad</h4>
            <div className="space-y-3">
              {(['high', 'medium', 'low'] as Priority[]).map(priority => {
                const count = projectTasks.filter(t => t.priority === priority).length;
                const percentage = projectTasks.length > 0 ? (count / projectTasks.length) * 100 : 0;
                
                return (
                  <div key={priority}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium capitalize ${getPriorityColor(priority)}`}>
                        {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                      <span className="text-sm text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full ${getPriorityColor(priority)}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold">Detalle de Tareas</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarea</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progreso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Esfuerzo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectTasks.map(task => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{task.name}</div>
                      <div className="text-sm text-gray-500">{formatDate(task.startDate)} - {formatDate(task.endDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {task.status === 'completed' ? 'Completada' : task.status === 'in-progress' ? 'En Progreso' : 'No Iniciada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${task.progress}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-900">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.assignedTo || 'Sin asignar'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${task.cost.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.effort}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Vista de Línea de Tiempo
  const TimelineView: FC = () => {
    if (!currentProject) return null;
    const projectTasks = tasks.filter(t => t.projectId === currentProject.id);
    
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-semibold mb-6">Línea de Tiempo del Proyecto</h4>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            <div className="space-y-6">
              {projectTasks
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                .map((task) => (
                  <div key={task.id} className="relative flex items-start">
                    <div className={`absolute left-2 w-4 h-4 rounded-full border-4 ${task.status === 'completed' ? 'bg-green-500 border-green-200' : task.status === 'in-progress' ? 'bg-blue-500 border-blue-200' : 'bg-gray-300 border-gray-200'}`}></div>
                    <div className="ml-10 bg-gray-50 rounded-lg p-4 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-900">{task.name}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                          {task.status === 'completed' ? 'Completada' : task.status === 'in-progress' ? 'En Progreso' : 'No Iniciada'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500"><Calendar size={14} className="inline mr-1" />{formatDate(task.startDate)} - {formatDate(task.endDate)}</span>
                          {task.assignedTo && (
                            <span className="text-gray-500"><User size={14} className="inline mr-1" />{task.assignedTo}</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${task.progress}%` }}></div>
                          </div>
                          <span className="text-gray-600">{task.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modales
  const renderModal = () => {
    if (!showModal) return null;

    const modalContent = {
      project: (
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Nuevo Proyecto</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nombre del proyecto" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Descripción del proyecto" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input type="date" value={newProject.startDate} onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input type="date" value={newProject.endDate} onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto</label>
                <input type="number" value={newProject.budget} onChange={(e) => setNewProject({ ...newProject, budget: parseInt(e.target.value) || 0 })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select value={newProject.priority} onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as Priority })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 pt-4">
              <button onClick={addProject} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Crear Proyecto</button>
              <button onClick={() => setShowModal(null)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">Cancelar</button>
            </div>
          </div>
        </div>
      ),
      task: (
        <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-screen overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Nueva Tarea</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nombre de la tarea" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Descripción de la tarea" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duración (días)</label>
                <input type="number" value={newTask.duration} onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input type="date" value={newTask.startDate} onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input type="date" value={newTask.endDate} onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asignar a</label>
              <select value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Seleccionar recurso</option>
                {resources.map(resource => (
                  <option key={resource.id} value={resource.name}>{resource.name} - {resource.role}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo</label>
                <input type="number" value={newTask.cost} onChange={(e) => setNewTask({ ...newTask, cost: parseInt(e.target.value) || 0 })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Esfuerzo (horas)</label>
                <input type="number" value={newTask.effort} onChange={(e) => setNewTask({ ...newTask, effort: parseInt(e.target.value) || 0 })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Tarea</label>
              <select value={newTask.type} onChange={(e) => setNewTask({ ...newTask, type: e.target.value as 'task' | 'group' | 'milestone' })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="task">Tarea</option>
                <option value="group">Grupo</option>
                <option value="milestone">Hito</option>
              </select>
            </div>
            <div className="flex space-x-3 pt-4">
              <button onClick={addTask} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Crear Tarea</button>
              <button onClick={() => setShowModal(null)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">Cancelar</button>
            </div>
          </div>
        </div>
      ),
      resource: (
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Nuevo Recurso</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" value={newResource.name} onChange={(e) => setNewResource({ ...newResource, name: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nombre completo" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={newResource.email} onChange={(e) => setNewResource({ ...newResource, email: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="email@empresa.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <input type="text" value={newResource.role} onChange={(e) => setNewResource({ ...newResource, role: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Desarrollador, Diseñador, etc." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo/Hora</label>
                <input type="number" value={newResource.cost} onChange={(e) => setNewResource({ ...newResource, cost: parseInt(e.target.value) || 0 })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad (%)</label>
                <input type="number" value={newResource.availability} onChange={(e) => setNewResource({ ...newResource, availability: parseInt(e.target.value) || 0 })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" max="100" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Habilidades (separadas por coma)</label>
              <input type="text" value={newResource.skills.join(', ')} onChange={(e) => setNewResource({ ...newResource, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="JavaScript, React, CSS, etc." />
            </div>
            <div className="flex space-x-3 pt-4">
              <button onClick={addResource} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Crear Recurso</button>
              <button onClick={() => setShowModal(null)} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">Cancelar</button>
            </div>
          </div>
        </div>
      )
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="max-h-screen overflow-y-auto">
          {showModal && modalContent[showModal]}
        </div>
      </div>
    );
  };

  // Barra de herramientas
  const Toolbar: FC = () => (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Buscar tareas..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-white">
              <Filter size={16} />
              <span>Filtrar</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {activeView === 'gantt' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Escala:</span>
              <select value={timeScale} onChange={(e) => setTimeScale(e.target.value)} className="px-3 py-1 border border-gray-300 rounded">
                <option value="hours">Horas</option>
                <option value="days">Días</option>
                <option value="weeks">Semanas</option>
                <option value="months">Meses</option>
              </select>
              
              <span className="text-sm text-gray-600">Zoom:</span>
              <div className="flex items-center space-x-2">
                <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="p-1 border border-gray-300 rounded hover:bg-gray-100">-</button>
                <span className="text-sm text-gray-600 w-12 text-center">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 25))} className="p-1 border border-gray-300 rounded hover:bg-gray-100">+</button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button className="p-2 border border-gray-300 rounded hover:bg-white" title="Deshacer"><Activity size={16} /></button>
            <button className="p-2 border border-gray-300 rounded hover:bg-white" title="Rehacer"><Activity size={16} className="rotate-180" /></button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button className="p-2 border border-gray-300 rounded hover:bg-white" title="Copiar"><Copy size={16} /></button>
            <button className="p-2 border border-gray-300 rounded hover:bg-white" title="Pegar"><Paperclip size={16} /></button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button className="p-2 border border-gray-300 rounded hover:bg-white" title="Configuración"><Settings size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );

  // Panel de propiedades (lateral derecho)
  const PropertiesPanel: FC = () => {
    const selectedTask = selectedTasks.length === 1 ? tasks.find(t => t.id === selectedTasks[0]) : null;

    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Propiedades</h3>
        </div>
        
        {selectedTask ? (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" value={selectedTask.name} onChange={(e) => { setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, name: e.target.value } : t)); }} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea value={selectedTask.description} onChange={(e) => { setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, description: e.target.value } : t)); }} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select value={selectedTask.status} onChange={(e) => { setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, status: e.target.value as Status } : t)); }} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                  <option value="not-started">No Iniciada</option>
                  <option value="in-progress">En Progreso</option>
                  <option value="completed">Completada</option>
                  <option value="delayed">Retrasada</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                <select value={selectedTask.priority} onChange={(e) => { setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, priority: e.target.value as Priority } : t)); }} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Progreso ({selectedTask.progress}%)</label>
              <input type="range" min="0" max="100" value={selectedTask.progress} onChange={(e) => updateTaskProgress(selectedTask.id, parseInt(e.target.value))} className="w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asignado a</label>
              <select value={selectedTask.assignedTo} onChange={(e) => { setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, assignedTo: e.target.value } : t)); }} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                <option value="">Sin asignar</option>
                {resources.map(resource => (
                  <option key={resource.id} value={resource.name}>{resource.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input type="date" value={selectedTask.startDate} onChange={(e) => { setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, startDate: e.target.value } : t)); }} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input type="date" value={selectedTask.endDate} onChange={(e) => { setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, endDate: e.target.value } : t)); }} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo</label>
                <input type="number" value={selectedTask.cost} onChange={(e) => { setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, cost: parseInt(e.target.value) || 0 } : t)); }} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Esfuerzo (h)</label>
                <input type="number" value={selectedTask.effort} onChange={(e) => { setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, effort: parseInt(e.target.value) || 0 } : t)); }} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dependencias</label>
              <div className="space-y-2">
                {tasks
                  .filter(t => t.projectId === currentProject?.id && t.id !== selectedTask.id)
                  .map(task => (
                    <label key={task.id} className="flex items-center space-x-2">
                      <input type="checkbox" checked={selectedTask.dependencies.includes(task.id)} onChange={(e) => {
                          const newDependencies = e.target.checked
                            ? [...selectedTask.dependencies, task.id]
                            : selectedTask.dependencies.filter(id => id !== task.id);
                          setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, dependencies: newDependencies } : t));
                        }} />
                      <span className="text-sm">{task.name}</span>
                    </label>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button onClick={() => deleteTask(selectedTask.id)} className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">
                  <Copy size={16} />
                  <span>Duplicar</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Selecciona una tarea para ver sus propiedades</p>
          </div>
        )}
      </div>
    );
  };

  // Panel de notificaciones
  const NotificationPanel: FC = () => (
    <div className="fixed top-4 right-4 z-50">
      <div className="space-y-2">
        <div className="bg-blue-500 text-white p-3 rounded-lg shadow-lg flex items-center space-x-2">
          <Bell size={16} />
          <span className="text-sm">Tarea "Diseño UI/UX" próxima a vencer</span>
          <button className="ml-2"><X size={16} /></button>
        </div>
      </div>
    </div>
  );

  // Renderizado de las diferentes vistas
  const renderView = () => {
    switch (activeView) {
      case 'gantt': return <GanttView />;
      case 'kanban': return <KanbanView />;
      case 'calendar': return <CalendarView />;
      case 'resources': return <ResourcesView />;
      case 'reports': return <ReportsView />;
      case 'timeline': return <TimelineView />;
      default: return <GanttView />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <Toolbar />
        
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            {renderView()}
          </div>
          
          {(activeView === 'gantt' || activeView === 'kanban') && <PropertiesPanel />}
        </div>
      </div>
      
      <NotificationPanel />
      {renderModal()}
    </div>
  );
};

export default ProjectManagementApp;