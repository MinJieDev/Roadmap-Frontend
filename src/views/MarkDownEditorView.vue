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
import { changeMTdata } from '../apis/MindTableEditorApis';
import { pushErr } from '../components/ErrPush';
// import { req } from '../apis/util';

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
      const dataChange = {
        id: this.$route.query.selected,
        note: this.editor.value(),
      };
      window.console.info(dataChange);
      changeMTdata(dataChange)
        .then(() => {
          this.$Message.info('修改成功!');
          this.$emit('reloadData');
        })
        .catch((err) => {
          pushErr(this, err, true);
        });
      this.$router.push({
        path: '/articleTable',
      });
    },
    cancel() {
      this.$router.push({
        path: '/articleTable',
      });
    },
    getData() {

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
