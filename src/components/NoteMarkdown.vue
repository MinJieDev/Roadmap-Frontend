<template>
  <div>
    <Modal
      v-model="noteModal"
      title="文献笔记"
      @on-ok="ok">
      <VueMarkdown style="margin-left: 20px">{{ note }}</VueMarkdown>
    </Modal>
  </div>
</template>
<script>
import VueMarkdown from 'vue-markdown';

export default {
  components: {
    VueMarkdown,
  },
  name: 'noteMarkdown',
  props: ['note'],
  data() {
    return {
      noteModal: false,
    };
  },
  methods: {
    ok() {
    },
    cancel() {
    },
    handleShowNoteModal() {
      this.noteModal = true;
      window.console.log('handleShowNoteModa:bug here:', this.note);
    },
  },
};
</script>
