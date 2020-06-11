<template>
  <div>
    <Modal
      v-model="noteModal"
      title="文献笔记">
      <div class="markdown-body">
        <VueMarkdown style="margin-left: 20px" v-if="noteModal">{{ computedNote }}</VueMarkdown>
      </div>
      <div slot="footer">
        <Button type="info" @click="handleClkEdit">编辑</Button>
        <Button type="error" @click="handleClkClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import VueMarkdown from 'vue-markdown';
import 'github-markdown-css';


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
    handleClkEdit() {
      this.noteModal = false;
      this.$emit('article-note-edit');
      window.console.log('edit clk');
    },
    handleClkClose() {
      this.noteModal = false;
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
