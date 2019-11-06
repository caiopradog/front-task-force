import Vue from 'vue'
import Router from 'vue-router'
import Tasks from './views/Tasks'
import Login from "./views/Login";
import Task from "./views/Task";
import User from "./views/User";
import Calendar from "./views/Calendar";
import ViewTask from "./views/ViewTask";

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
        path: '/user/:id?',
        name: 'user',
        component: User,
        meta: {
            title: 'User'
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
        name: 'view_task',
        component: ViewTask,
        meta: {
            title: 'Andamento da Tarefa'
        }
    }]
})
