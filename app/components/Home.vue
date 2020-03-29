<template>
    <Page>
        <ActionBar class="nt-action-bar" title="Todos">
            <ActionItem text="Add" @tap="onAddTap"></ActionItem>
            <ActionItem text="Refresh" @tap="forceRerender"></ActionItem>
        </ActionBar>
        <TodoList :todos="this.$store.getters.todos"></TodoList>
    </Page>
</template>

<script>
    import TodoList from "./TodoList"
    import AddTodo from "./AddTodo";

    export default {
        components: {
            TodoList,
            AddTodo
        },

        created(){
            this.$store.dispatch("getToken")
        },
        mounted() {
            setTimeout(()=>{
                this.$store.dispatch('getTodos')
            },2000);
        },
        methods: {
            onAddTap() {
                this.$showModal(AddTodo)
                    .then(newItem => {
                        if (newItem) {
                            console.log(newItem);
                            this.$store.dispatch('addTodo',newItem)
                        }
                    })
            },


            forceRerender() {
                this.$store.commit('setTodoList',[]);
                setTimeout(()=>{
                    this.$store.dispatch('getTodos')
                },2000)
            }
        }

    };
</script>

<style scoped="scss">
    .info {
        font-size: 20;
        horizontal-align: center;
        vertical-align: center;
    }
</style>
