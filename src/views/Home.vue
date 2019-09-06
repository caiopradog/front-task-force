<template>
  <div class="container my-5">
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
                <select-2 v-bind:name="'Status'" v-bind:component-class="'form-control'" v-bind:options="statusOpts"
                          v-model="tableFilter.status"></select-2>
              </div>
              <div class="col-3">
                <select-2 v-bind:name="'Categoria'" v-bind:component-class="'form-control'" v-bind:options="categoriesOpts"
                          v-model="tableFilter.category"></select-2>
              </div>
              <div class="col-3">
                <select-2 v-bind:name="'Projeto'" v-bind:component-class="'form-control'" v-bind:options="projectsOpts"
                          v-model="tableFilter.project_id" v-bind:search="true"></select-2>
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
                </tr>
                </thead>
                <tbody>
                  <template v-if="!tableData.data || tableData.data.length === 0">
                    <tr>
                      <td class="text-center" colspan="7">Não há dados disponíveis</td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr v-for="data in tableData.data" v-bind:key="data.id">
                      <td>
                        <span v-bind:class="data.status_badge">
                          {{ data.status }}
                        </span>
                      </td>
                      <td>{{ data.name }}</td>
                      <td>{{ data.project.name }}</td>
                      <td>{{ data.sprint.name }}</td>
                      <td>{{ data.epic.name }}</td>
                      <td>{{ data.time_planned | secToHourMin }}</td>
                      <td>{{ data.time_used | secToHourMin }}</td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div class="table-footer row align-items-center" v-if="tableData.data && tableData.data.length > 0">
              <div class="col-4">
                Exibindo {{ tableData.from }} a {{ tableData.to }} de {{ tableData.total }}
              </div>
              <div class="col-4 text-center">
                <div class="btn-group">
                  <button class="btn btn-outline-primary" v-bind:disabled="tableData.current_page === 1" v-on:click="getTasks(1)">
                    <fa icon="caret-left"></fa>
                    <fa icon="caret-left"></fa>
                  </button>
                  <button class="btn btn-outline-primary" v-bind:disabled="tableData.current_page === 1" v-on:click="getTasks(tableData.current_page-1)">
                    <fa icon="caret-left"></fa>
                  </button>
                  <button v-for="button in tableButtons" v-bind:key="button" class="btn"
                          v-bind:class="{'btn-outline-primary': button !== tableData.current_page, 'btn-primary': button === tableData.current_page}"
                          v-on:click="getTasks(button)">
                    {{ button }}
                  </button>
                  <button class="btn btn-outline-primary" v-bind:disabled="tableData.current_page === tableData.last_page" v-on:click="getTasks(tableData.current_page+1)">
                    <fa icon="caret-right"></fa>
                  </button>
                  <button class="btn btn-outline-primary" v-bind:disabled="tableData.current_page === tableData.last_page" v-on:click="getTasks(tableData.last_page)">
                    <fa icon="caret-right"></fa>
                    <fa icon="caret-right"></fa>
                  </button>
                </div>
              </div>
              <div class="col-4 text-right">
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
  </div>
</template>

<script>
    import Select2 from '../components/Select2';
    export default {
        name: 'Home',
        data: function () {
            return {
                tableFilter: {
                    search: '',
                    status: '',
                    project_id: '',
                    category: '',
                    page: 1,
                    perPage: 15,
                },
                tableData: [],
                statusOpts: [],
                projectsOpts: [],
                categoriesOpts: [],
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
            }
        },
        mounted: function() {
            this.$http({
                url: '/task_statuses'
            }).then(response => this.statusOpts = response.data);

            this.$http({
                url: '/task_categories'
            }).then(response => this.categoriesOpts = response.data);

            this.$http({
                url: '/projects',
                params: {status: "Ativo"}
            }).then(response => {
                for (let data of response.data) {
                    this.projectsOpts.push({name: data.name, value: data.id});
                }
            });
        },
        components: {
            'select-2': Select2
        }
    }
</script>
