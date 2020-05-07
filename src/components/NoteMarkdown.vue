<template>
  <div>
    <Modal
      v-model="noteModal"
      title="文献笔记"
      @on-ok="ok">
      <VueMarkdown style="margin-left: 20px">{{ computedNote }}</VueMarkdown>
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
  computed: {
    /**
     * 解决prop无法成功挂getter-setter钩子的问题
     */
    computedNote() {
      return this.note;
    },
  },
};
</script>
