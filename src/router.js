import Vue from 'vue'
import Router from 'vue-router'
import Tasks from './views/Tasks'
import Login from "./views/Login";
import Task from "./views/Task";
import User from "./views/User";
import Calendar from "./views/Calendar";
import ViewTask from "./views/ViewTask";
import Users from "./views/Users";
import Projects from "./views/Projects";
import Rewards from "./views/Rewards";
import Project from "./views/Project";
import Epics from "./views/Epics";
import Epic from "./views/Epic";
import Sprints from "./views/Sprints";
import Sprint from "./views/Sprint";
import Reward from "./views/Reward";

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        name: 'login',
        component: Login,
        meta: {
            title: 'Login'
        }
    }, {
        path: '/users',
        name: 'users',
        component: Users,
        meta: {
            title: 'Users'
        }
    }, {
        path: '/user/:id?',
        name: 'user',
        component: User,
        meta: {
            title: 'User'
        }
    }, {
        path: '/rewards',
        name: 'rewards',
        component: Rewards,
        meta: {
            title: 'Recompensas'
        }
    }, {
        path: '/reward/:id?',
        name: 'reward',
        component: Reward,
        meta: {
            title: 'Recompensa'
        }
    }, {
        path: '/projects',
        name: 'projects',
        component: Projects,
        meta: {
            title: 'Projetos'
        }
    }, {
        path: '/project/:id?',
        name: 'project',
        component: Project,
        meta: {
            title: 'Projeto'
        }
    }, {
        path: '/epics',
        name: 'epics',
        component: Epics,
        meta: {
            title: 'Épicos'
        }
    }, {
        path: '/epic/:id?',
        name: 'epic',
        component: Epic,
        meta: {
            title: 'Épico'
        }
    }, {
        path: '/sprints',
        name: 'sprints',
        component: Sprints,
        meta: {
            title: 'Sprints'
        }
    }, {
        path: '/sprint/:id?',
        name: 'sprint',
        component: Sprint,
        meta: {
            title: 'Sprint'
        }
    }, {
        path: '/tasks',
        name: 'tasks',
        component: Tasks,
        meta: {
            title: 'Tarefas'
        }
    }, {
        path: '/calendar',
        name: 'calendar',
        component: Calendar,
        meta: {
            title: 'Calendário de Tarefas'
        }
    }, {
        path: '/task/:id?',
        name: 'task',
        component: Task,
        meta: {
            title: 'Tarefa'
        }
    }, {
        path: '/view_task/:id',
        name: 'view-task',
        component: ViewTask,
        meta: {
            title: 'Andamento da Tarefa'
        }
    }]
})
