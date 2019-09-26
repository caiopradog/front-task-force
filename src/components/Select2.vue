<template>
  <div class="select-2" v-bind:class="componentClass" v-click-outside="closeSelect">
    <div class="select-input" v-on:click="openSelect">
      <div class="select-name">
        {{ shownName }}
      </div>
      <div class="select-icon">
        <fa icon="caret-down" v-if="!open"></fa>
        <fa icon="caret-up" v-else></fa>
      </div>
    </div>

    <div class="select-popup" v-bind:class="[popupClass, (open ? '' : 'd-none')]">
      <div class="select-filter" v-if="search">
        <fa icon="search"></fa>
        <input class="form-control" type="text" v-model="filter">
      </div>
      <div class="select-options">
        <input v-bind:id="name+'none'"  v-bind:key="name+'none'" type="radio" v-bind:name="name" v-bind:value="{name: '',val: ''}" v-model="selected">
        <label v-bind:for="name+'none'">Selecionar</label>
        <template v-for="option in filteredOptions">
          <input v-bind:id="option.value"  v-bind:key="name+option.value" type="radio" v-bind:name="name"
                 v-bind:value="option" v-model="selected">
          <label v-bind:for="option.value" v-bind:key="option.value">{{ option.name }}</label>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
    import ClickOutside from 'vue-click-outside';

    export default {
        name: 'Select2',
        data: function () {
            return {
                open: false,
                selected: {
                    name: '',
                    val: ''
                },
                filter: '',
            }
        },
        computed: {
            shownName: function () {
                if (this.selected.val === "") {
                    return this.name;
                } else {
                    return this.selected.name;
                }
            },
            filteredOptions: function () {
                let options = [];

                if (this.filter !== '') {
                    const lcFilter = this.filter.toLowerCase();
                    for (let option of this.options) {
                        const lcName = option.name.toLowerCase();
                        if (lcName.includes(lcFilter)) {
                            options.push(option);
                        }
                    }
                } else {
                    options = this.options;
                }

                return options;
            }
        },
        watch: {
            selected: function() {
                this.$emit('change', this.selected.value);
                this.$emit('input', this.selected.value);
            },
            default: function () {
                for (let option of this.options) {
                    if (option.value == this.default) {
                        this.selected = option;
                    }
                }
            }
        },
        methods: {
            closeSelect: function () {
                this.open = false;
            },
            openSelect: function () {
                this.open = true;
            }
        },
        props: {
            options: Array,
            name: String,
            popupClass: String,
            componentClass: String,
            default: {
                default: false
            },
            multiple: {
                default: false
            },
            search: {
                default: false
            },
        },
        directives: {
            ClickOutside
        },
        mounted: function() {
            if (this.default) {
                for (let option of this.options) {
                    if (option.value == this.default) {
                        this.selected = option;
                    }
                }
            }
        }
    }
</script>
