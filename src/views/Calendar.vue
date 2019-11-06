<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            Calendário de Tarefas
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-3">
                <select-2 :name="'Usuário'" :component-class="'form-control'" :options="usersOpts" :default="$store.state.user.id"
                          v-model="calendarFilter.devUserId"></select-2>
              </div>
              <div class="col-3">
                <select-2 :name="'Status'" :component-class="'form-control'" :options="statusOpts"
                          v-model="calendarFilter.status"></select-2>
              </div>
              <div class="col-3">
                <select-2 :name="'Categoria'" :component-class="'form-control'" :options="categoriesOpts"
                          v-model="calendarFilter.category"></select-2>
              </div>
              <div class="col-3">
                <select-2 :name="'Projeto'" :component-class="'form-control'" :options="projectsOpts"
                          v-model="calendarFilter.projectId" :search="true"></select-2>
              </div>
            </div>
            <full-calendar :events="tasks"
                           :plugins="calendar.plugins"
                           :header="calendar.header"
                           :custom-buttons="calendar.customButtons"
                           @eventClick="eventClick"
                           :height="'auto'"
                           locale="pt-br"></full-calendar>
          </div>
        </div>
      </div>
    </div>
    <button class="btn btn-circle btn-primary btn-add btn-lg" v-on:click="goToTask(null)">
      <fa icon="plus"></fa>
    </button>
  </div>
</template>

<script>
    import FullCalendar from "@fullcalendar/vue";
    import dayGridPlugin from "@fullcalendar/daygrid";
    import interactionPlugin from "@fullcalendar/interaction";
    import "@fullcalendar/core/main.css";
    import "@fullcalendar/daygrid/main.css";
    import Select2 from '../components/Select2';
    export default {
        name: 'Calendar',
        data: function () {
            return {
                calendarButtonText: 'teste',
                calendarFilter: {
                    devUserId: '',
                    status: '',
                    projectId: '',
                    category: '',
                    dateField: 'start_date',
                },
                tasks: [],
                usersOpts: [],
                statusOpts: [],
                projectsOpts: [],
                categoriesOpts: [],
                timeout: false,
                calendar: {
                    plugins: [
                        dayGridPlugin,
                        interactionPlugin
                    ],
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'startDate,deadline'
                    },
                    customButtons: {
                        startDate: {
                            text: 'Data de Início',
                            click: () => this.calendarFilter.dateField = 'start_date'
                        },
                        deadline: {
                            text: 'Data de Entrega',
                            click: () => this.calendarFilter.dateField = 'deadline'
                        }
                    }
                },
            }
        },
        watch: {
            calendarFilter: {
                deep: true,
                handler() {
                    if (this.timeout) clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        this.getTasks();
                    }, 500);
                },
            }
        },
        methods: {
            getTasks: function () {
                this.$http({
                    url: "/calendar",
                    params: this.calendarFilter
                }).then(response => {
                    this.tasks = response.data;
                }).catch(() => {
                    this.tasks = []
                })
            },
            eventClick: function (event) {
                this.goToTask(event.event.id);
            },
            getTasksStatuses: function () {
                return this.$http({
                    url: '/task_statuses'
                });
            },
            assignTasks: function () {
                return this.$http({
                    url: '/assign_tasks',
                    method: "POST"
                });
            },
            getTasksCategories: function () {
                return this.$http({
                    url: '/task_categories'
                });
            },
            getProjects: function () {
                return this.$http({
                    url: '/projects',
                    params: {status: "Ativo"}
                });
            },
            getUsers: function () {
                return this.$http({
                    url: '/users'
                });
            },
            goToTask: function (id) {
                this.$store.state.loading = true;
                this.$router.push({ name: 'view_task', params: { id: id }});
            }
        },
        mounted: function() {
            this.getTasksStatuses().then(response => {
                this.statusOpts = response.data
                return this.getTasksCategories()
            }).then(response => {
                this.categoriesOpts = response.data
                return this.getUsers()
            }).then(response => {
                for (let data of response.data) {
                    this.usersOpts.push({name: data.name, value: data.id});
                }
                return this.getProjects()
            }).then(response => {
                for (let data of response.data) {
                    this.projectsOpts.push({name: data.name, value: data.id});
                }
                this.$store.state.loading = false;
            })
        },
        components: {
            'select-2': Select2,
            'full-calendar': FullCalendar
        }
    }
</script>
