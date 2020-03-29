<template>
    <Page>
        <ActionBar class="nt-action-bar" title="Todos">
            <ActionItem text="Back" @tap="$navigateBack"></ActionItem>
        </ActionBar>
        <StackLayout>
            <Label :text="todo.content"></Label>
            <Image v-if="this.todo.media_url" :src="src" width="75" height="75" />
        </StackLayout>
    </Page>
</template>

<script>
    export default {
        props: ["todo"],
        data(){
            return {
                src : this.todo.media_url
            }
        }
    }
</script>
