<template>
    <StackLayout orientation="horizontal" >
        <Label :text="todo.content" @tap="showDetails"></Label>
        <Button text="Edit" @tap="onButtonTap"></Button>
        <Button v-if="todo.done === false" text="Yes" @tap="setDone"></Button>
        <Button v-if="todo.done === true" text="No" @tap="setDone"></Button>
        <Button v-if="todo.done === true" text="Suppr" @tap="onButtonDelete"></Button>
    </StackLayout>
</template>

<script>
    import EditTodo from "./EditTodo";
    import Details from "./Details";
    export default {

        props: ["todo"],
        components : {
            EditTodo,
            Details
        },
        methods: {
            onButtonDelete() {
                 this.$store.dispatch('onButtonTapDelete', this.todo)
            },

            showDetails(){
                this.$navigateTo(Details, {
                    props: {
                        todo: this.todo
                    }
                })
            },

            setDone(){
                this.$store.dispatch('patchTodoDone',this.todo)
            },
            created(){
            },
            onButtonTap() {
                this.$showModal(EditTodo,{
                    props: {
                        todoEdit: this.todo
                    }
                })
                    .then(EditTodo => {
                        console.log(this.todo.uuid)
                        this.$store.dispatch('patchTodo',{id : this.todo.uuid,edit: EditTodo})
                    })
            },

        },
    };
</script>
<style scoped="scss">

</style>
