<template>
  <div class="task-view">
    <div class="row">
      <div class="col-9">
        <div class="card">
          <div class="card-header">
             {{ task.project.name }}
          </div>
          <div class="card-body">
            <input class="task-input title" v-model="task.name">
            <textarea class="task-input desc" v-model="task.description"></textarea>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="card">
          <div class="card-header">
            <div class="btn-group btn-group-sm" v-on:click="updateStatus()">
              <button class="btn" :class="'btn-outline-'+task.status_color">{{ task.status }}</button>
              <button class="btn" :class="'btn-outline-'+task.status_color"
                      v-if="task.status !== 'Qualidade' && task.status !== 'Finalizado'">
                <fa icon="caret-right"></fa>
              </button>
            </div>
            <button class="ml-3 btn btn-sm btn-outline-success"
                    v-if="task.status !== 'Qualidade' && task.status !== 'Finalizado'"
                    v-on:click="updateStatus('Finalizado')">
              <fa icon="check"></fa>
            </button>
            <template v-else-if="task.status === 'Qualidade'">
              <button class="ml-3 btn btn-sm btn-outline-success" v-on:click="approveTask()">
                <fa icon="thumbs-up"></fa>
              </button>
              <button class="ml-3 btn btn-sm btn-outline-danger" v-on:click="reproveTask()">
                <fa icon="thumbs-down"></fa>
              </button>
            </template>
          </div>
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-6">
                Data de início:
              </div>
              <div class="col-6">
                {{ task.start_date | datetime }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6">
                Data da entrega:
              </div>
              <div class="col-6">
                {{ task.deadline | datetime }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6">
                Horas previstas:
              </div>
              <div class="col-6">
                {{ task.time_planned | secToHourMin }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6">
                Horas utilizadas:
              </div>
              <div class="col-6">
                {{ hoursUsed | secToHourMin }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6">
                Responsável:
              </div>
              <div class="col-6">
                {{ task.dev_user.name }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6">
                Categoria:
              </div>
              <div class="col-6">
                {{ task.category }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6">
                Prioridade:
              </div>
              <div class="col-6">
                {{ task.priority }}
              </div>
            </div>
            <div class="row my-2">
              <div class="col-12">
                <hr>
              </div>
            </div>
            <div class="row">
              <div class="col-5 offset-1">
                <button class="btn btn-block btn-outline-success" v-on:click="goBackAndSave()">Salvar e Voltar</button>
              </div>
              <div class="col-5">
                <button class="btn btn-block btn-outline-light" v-on:click="goBack()">Voltar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-12">
        <div class="task-log">
          <div class="log">
            <div class="text">{{ createdTaskText }}</div>
            <div class="info">{{ task.created_at | datetime }}</div>
          </div>
          <div class="log" v-for="log in taskLogs" :key="log.id">
            <div class="text" v-html="log.comment"></div>
            <div class="info">{{ logInfo(log) }}</div>
          </div>
        </div>
        <form class="log-input" v-on:submit.prevent="addToLogs()">
          <input type="text" v-model="taskLog.comment" class="comment-text" placeholder="Adicione um comentário">
          <button type="button" class="btn border-0" v-on:click="showCommentTime = !showCommentTime"
                  :class="{'btn-outline-light': !showCommentTime, 'btn-light time-open': showCommentTime}">
            <fa icon="stopwatch"></fa>
          </button>
          <the-mask :mask="['#:##', '##:##']" :masked="true" class="comment-time" :class="{'show': showCommentTime}"
                    placeholder="Horas" v-model="taskLog.time"/>
          <button class="btn btn-outline-light border-0 ml-2">
            <fa icon="paper-plane"></fa>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'ViewTask',
        data: function () {
            return {
                task: {
                    name: '',
                    status: '',
                    category: '',
                    deadline: '',
                    start_date: '',
                    project_id: 0,
                    sprint_id: 0,
                    epic_id: 0,
                    time_planned: '',
                    time_used: '',
                    priority: 0,
                    qa_user_id: 0,
                    dev_user_id: 0,
                    description: '',
                    project: {
                        name: ''
                    },
                    dev_user: {
                        name: ''
                    },
                },
                taskLog: {
                    comment: '',
                    time: ''
                },
                taskLogs: [],
                error: {},
                statusOpts: [],
                showCommentTime: false,
                request: false,
                commentRequest: false,
                id: this.$route.params.id,
            }
        },
        computed: {
            createdTaskText: function () {
                if (this.task.created_user) {
                    let user = this.task.created_user.name;
                    if (this.task.user_created_id == this.$store.state.user.id) {
                        user = "Você";
                    }

                    return user+" criou a tarefa";
                }
                return 'Tarefa criada';
            },
            hoursUsed: function () {
                return this.taskLogs.map(a => a.time).reduce((a, b) => a+b, 0)
            }
        },
        methods: {
            logInfo: function (log) {
                return [
                    log.user,
                    log.time > 0 ? this.$options.filters.secToHourMin(log.time) : 0,
                    this.$options.filters.datetime(log.created)
                ].filter(a => a).join(' - ');
            },
            addToLogs: function () {
                if (this.taskLog.comment !== "" && !this.commentRequest) {
                    this.commentRequest = this.$http({
                        url: '/add_task_comment/'+this.id,
                        method: 'put',
                        data: this.taskLog
                    }).then(response => {
                        this.taskLogs.push({
                            id: response.data.comment.id,
                            comment: response.data.comment.html_comment,
                            time: response.data.comment.time,
                            user: response.data.comment.user,
                            created: response.data.comment.created_at,
                            class: response.data.comment.css_class
                        });
                        this.$notify({
                            text: response.data.msg,
                            type: 'success'
                        });
                        this.taskLog.comment = '';
                        this.taskLog.time = '';
                    }).catch(error => {
                        this.error = error.response.data.errors;
                    }).finally(() => {
                        this.commentRequest = false;
                    });
                }
            },
            saveTask: function () {
                this.request = true;

                let url = '/task/'+this.id;

                this.$http({
                    url: url,
                    method: 'put',
                    data: this.task
                }).then(response => {
                    this.error = {};
                    this.$notify({
                        text: response.data.msg,
                        type: 'success'
                    });
                }).catch(error => {
                    this.error = error.response.data.errors;
                }).finally(() => {
                    this.request = false;
                });
            },
            getTasksStatuses: function () {
                return this.$http({
                    url: '/task_statuses'
                });
            },
            getCurrentTask: function () {
                return this.$http({
                    url: '/task/'+this.id,
                    params: {
                        withRelations: true
                    }
                })
            },
            fetchAllData: function () {
                this.$store.state.loading = true;
                this.getTasksStatuses().then(response => {
                    this.statusOpts = response.data;
                    return this.getCurrentTask()
                }).then(response => {
                    this.task = response.data;
                    this.taskLogs = response.data.task_comments.map(log => {
                        return {
                            comment: log.html_comment,
                            time: log.time,
                            type: log.type,
                            created: log.created_at,
                            user: log.created_user.name,
                            class: log.css_class,
                        }
                    });
                    this.$store.state.loading = false;
                }).catch(() => {
                    this.$store.state.user = false;
                    this.$router.go(-100);
                    this.$router.replace('/');
                });
            },
            updateStatus: function (status) {
                if (this.task.status !== 'Qualidade' && this.task.status !== 'Finalizado') {
                    this.$http({
                        url: '/update_status/'+this.id,
                        method: 'post',
                        params: {
                            status: status
                        }
                    }).then(response => {
                        this.task.status = response.data.task.status;
                        this.task.status_color = response.data.task.status_color;
                        this.taskLogs.push({
                            id: response.data.comment.id,
                            comment: response.data.comment.html_comment,
                            time: response.data.comment.time,
                            user: response.data.comment.user,
                            created: response.data.comment.created_at,
                            class: response.data.comment.css_class
                        });
                    });
                }
            },
            approveTask: function () {
                if (this.task.status === 'Qualidade') {
                    this.$http({
                        url: '/approve_task/'+this.id,
                        method: 'post'
                    }).then(response => {
                        this.task.status = response.data.task.status;
                        this.task.status_color = response.data.task.status_color;
                        this.taskLogs.push({
                            id: response.data.comment.id,
                            comment: response.data.comment.html_comment,
                            time: response.data.comment.time,
                            user: response.data.comment.user,
                            created: response.data.comment.created_at,
                            class: response.data.comment.css_class
                        });
                    });
                }
            },
            reproveTask: function () {
                if (this.task.status === 'Qualidade') {
                    this.$http({
                        url: '/reprove_task/'+this.id,
                        method: 'post'
                    }).then(response => {
                        this.task.status = response.data.task.status;
                        this.task.status_color = response.data.task.status_color;
                        this.taskLogs.push({
                            id: response.data.comment.id,
                            comment: response.data.comment.html_comment,
                            time: response.data.comment.time,
                            user: response.data.comment.user,
                            created: response.data.comment.created_at,
                            class: response.data.comment.css_class
                        });
                    });
                }
            },
            goBackAndSave: function () {
                this.saveTask();
                this.goBack();
            },
            goBack: function () {
                this.$store.state.loading = true;
                this.$router.back();
            },
            secToTime: function (seconds) {
                const h = Math.floor(seconds / 3600);
                const m = Math.floor((seconds % 3600) / 60);
                return [
                    h,
                    m > 9 ? m : (h ? '0' + m : m || '0'),
                ].filter(a => a).join(':');
            }
        },
        mounted() {
            this.fetchAllData();
        }
    }
</script>
