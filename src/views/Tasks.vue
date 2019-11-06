<template>
  <div>
    <transition name="slide-top">
      <div class="action-confirm" v-if="deleteID">
        <div class="card">
          <div class="card-header">
            Tem certeza que quer deletar a tarefa?
          </div>
          <div class="card-body">
            Essa ação não pode ser desfeita!
          </div>
          <div class="card-footer">
            <button class="btn btn-danger mr-2" v-on:click="deleteTask(deleteID)">Deletar</button>
            <button class="btn btn-secondary" v-on:click="deleteID = false">Voltar</button>
          </div>
        </div>
      </div>
    </transition>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            Tarefas
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-3">
                <input type="text" class="form-control" placeholder="Nome da Tarefa" v-model="tableFilter.search">
              </div>
              <div class="col-3">
                <select-2 :name="'Status'" :component-class="'form-control'" :options="statusOpts"
                          v-model="tableFilter.status"></select-2>
              </div>
              <div class="col-3">
                <select-2 :name="'Categoria'" :component-class="'form-control'" :options="categoriesOpts"
                          v-model="tableFilter.category"></select-2>
              </div>
              <div class="col-3">
                <select-2 :name="'Projeto'" :component-class="'form-control'" :options="projectsOpts"
                          v-model="tableFilter.project_id" :search="true"></select-2>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table">
                <thead>
                <tr>
                  <th>Status</th>
                  <th>Nome</th>
                  <th>Projeto</th>
                  <th>Épico</th>
                  <th>Sprint</th>
                  <th>Previsão</th>
                  <th>Realizado</th>
                  <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                  <template v-if="!tableData.data || tableData.data.length === 0">
                    <tr>
                      <td class="text-center" colspan="7">Não há dados disponíveis</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr v-for="data in tableData.data" :key="data.id">
                      <td>
                        <span class="badge" :class="'badge-'+data.status_color">
                          {{ data.status }}
                        </span>
                      </td>
                      <td v-tooltip="data.name">{{ data.name }}</td>
                      <td v-tooltip="data.project.name">{{ data.project.name }}</td>
                      <td v-tooltip="data.sprint.name">{{ data.sprint.name }}</td>
                      <td v-tooltip="data.epic.name">{{ data.epic.name }}</td>
                      <td>{{ data.time_planned | secToHourMin }}</td>
                      <td>{{ data.time_used | secToHourMin }}</td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-sm btn-primary" type="button" v-on:click="goToTask(data.id)"><fa icon="pen-square"/></button>
                          <button class="btn btn-sm btn-danger" type="button" v-on:click="deleteID = data.id"><fa icon="trash"/></button>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div class="table-footer row align-items-center" v-if="tableData.data && tableData.data.length > 0">
              <div class="col-3">
                Exibindo {{ tableData.from }} a {{ tableData.to }} de {{ tableData.total }}
              </div>
              <div class="col-6 text-center">
                <div class="btn-group">
                  <button class="btn btn-outline-primary" :disabled="tableData.current_page === 1" v-on:click="getTasks(1)">
                    <fa icon="caret-left"/>
                    <fa icon="caret-left"/>
                  </button>
                  <button class="btn btn-outline-primary" :disabled="tableData.current_page === 1" v-on:click="getTasks(tableData.current_page-1)">
                    <fa icon="caret-left"/>
                  </button>
                  <button v-for="button in tableButtons" :key="button" class="btn"
                          :class="{'btn-outline-primary': button !== tableData.current_page, 'btn-primary': button === tableData.current_page}"
                          v-on:click="getTasks(button)">
                    {{ button }}
                  </button>
                  <button class="btn btn-outline-primary" :disabled="tableData.current_page === tableData.last_page" v-on:click="getTasks(tableData.current_page+1)">
                    <fa icon="caret-right"/>
                  </button>
                  <button class="btn btn-outline-primary" :disabled="tableData.current_page === tableData.last_page" v-on:click="getTasks(tableData.last_page)">
                    <fa icon="caret-right"/>
                    <fa icon="caret-right"/>
                  </button>
                </div>
              </div>
              <div class="col-3 text-right">
                Exibindo
                <select v-model="tableFilter.perPage">
                  <option value="5">5</option>
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                itens por página
              </div>
            </div>
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
    import Select2 from '../components/Select2';
    export default {
        name: 'Tasks',
        data: function () {
            return {
                tableFilter: {
                    search: '',
                    status: '',
                    projectId: '',
                    category: '',
                    page: 1,
                    perPage: 15,
                },
                tableData: [],
                statusOpts: [],
                projectsOpts: [],
                categoriesOpts: [],
                deleteID: false,
                timeout: false
            }
        },
        watch: {
            tableFilter: {
                deep: true,
                immediate: true,
                handler() {
                    if (this.timeout) clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        this.getTasks(false);
                    }, 500);
                },
            }
        },
        computed: {
            tableButtons: function () {
                const min = this.tableData.current_page-2;
                const max = this.tableData.current_page+2;

                let buttons = [];
                for(let i = min;i <= max;i ++) {
                    if (i > 0 && i <= this.tableData.last_page) {
                        buttons.push(i)
                    }
                }

                return buttons;
            }
        },
        methods: {
            getTasks: function (page) {
                if (page) {
                    this.tableFilter.page = page;
                }

                this.$http({
                    url: "/tasks",
                    params: this.tableFilter
                }).then(response => {
                    this.tableData = response.data;
                }).catch(() => {
                    this.tableData = []
                })
            },
            getTasksStatuses: function () {
                return this.$http({
                    url: '/task_statuses'
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
            deleteTask: function (id) {
                return this.$http({
                    url: '/task/'+id,
                    method: 'delete',
                }).then(response => {
                    this.deleteID = false;
                    this.$notify({
                        text: response.data.msg,
                        type: 'success'
                    });
                    this.getTasks(false);
                });
            },
            goToTask: function (id) {
                this.$store.state.loading = true;
                this.$router.push({ name: 'task', params: { id: id }});
            }
        },
        mounted: function() {
            this.getTasksStatuses().then(response => {
                this.statusOpts = response.data
                return this.getTasksCategories()
            }).then(response => {
                this.categoriesOpts = response.data
                return this.getProjects()
            }).then(response => {
                for (let data of response.data) {
                    this.projectsOpts.push({name: data.name, value: data.id});
                }
                this.$store.state.loading = false;
            })
        },
        components: {
            'select-2': Select2
        }
    }
</script>
