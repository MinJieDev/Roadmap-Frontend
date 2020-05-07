<template>
    <div>
      <Button type="primary" @click="save" style="margin-left: 40px">保存</Button>
      <Button type="warning" @click="cancel" style="margin-left: 10px">取消</Button>
      <Row :gutter="32" style="margin-left: 20px; margin-right: 20px; margin-top: 10px">
      <Col span="20">
        <div class="markdown-wrapper">
          <textarea ref="editor">
          </textarea>
        </div>
      </Col>
      </Row>
    </div>
</template>

<script>
import Simplemde from 'simplemde';
import 'simplemde/dist/simplemde.min.css';
// import VueMarkdown from 'vue-markdown';
// import { req } from '../apis/util';
// import { pushErr } from '../components/ErrPush';

export default {
  name: 'MarkDownEditorView',
  components: { Simplemde },
  props: {
  },
  data() {
    return {
      editor: null,
    };
  },
  methods: {
    save() {
      window.console.info(this.editor.value());
    },
    cancel() {

    },
  },
  mounted() {
    this.editor = new Simplemde({
      placeholder: 'Type here...',
      toolbar: ['bold', 'italic', 'heading', '|',
        'quote', 'code', '|',
        'unordered-list', 'ordered-list', '|',
        'link', 'image', '|', 'preview'],
    });
  },
};
</script>


<style scoped>
</style>
