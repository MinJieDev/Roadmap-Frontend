<template>
  <div>
    <Drawer
      title="查看"
      v-model="drawer"
      width="720"
      :mask-closable="false"
      :styles="styles"
      @on-close="cancelDrawer"
    >
      <h3>题目</h3>
      <br>
      <Row :gutter="32">
        <Col span="24">
          <Row :gutter="50" style="margin-left: 0px">
            <Col>
              <Input
                v-model="drawerFormData.title"
                clearable
                placeholder="请输入文章标题">
              </Input>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row :gutter="32">
        <Col span="10">
          <br>
          <h3>作者</h3>
          <br>
          <Row :gutter="50" style="margin-left: 20px">
            <Input
              v-model="drawerFormData.author"
              clearable
              placeholder="请输入作者">
            </Input>
          </Row>
        </Col>

        <Col span="12">
          <br>
          <h3>链接(URL)</h3>
          <br>
          <Row :gutter="50" style="margin-left: 20px">
            <Input
              v-model="drawerFormData.url"
              clearable
              placeholder="请输入网址(URL)">
              <span slot="prepend">http://</span>
            </Input>
          </Row>
        </Col>
      </Row>
      <br>
      <h3>笔记</h3>
      <br>
      <Row :gutter="50" style="margin-left: 20px; margin-right: 20px">
        <Input
          type="textarea"
          v-model="drawerFormData.note"
          :rows="4"
          clearable
          placeholder="请输入描述或笔记">
        </Input>
      </Row>
      <br>
      <br>
      <h3>引用文献</h3>
      <br>
      <Row :gutter="50" style="margin-left: 30px">
        <Transfer
          :data="transferData"
          :target-keys="targetKeys"
          filterable
          @on-change="handleTransferChange"></Transfer>
      </Row>

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="cancelDrawer">取消</Button>
        <Button type="primary" @click="submitDrawer">提交修改</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
import _ from 'lodash';
import { req } from '../apis/util';

export default {
  name: 'ItemEditor',
  props: {
    drawer: {
      type: Boolean,
    },
    index: {
      type: Number,
      default: -1,
    },
    drawerFormData: {
      type: Object,
    },
  },
  data() {
    return {
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static',
      },
      transferData: [],
    };
  },
  async mounted() {
    const data = (await req('/api/articles', 'GET')).data;

    // 'key' is required by iview transfer
    this.transferData = _.map(data, atc => ({ key: atc.id, label: atc.title }));

    // lazy loading this, just after all article data loaded
  },
  computed: {
    targetKeys() {
      return this.drawerFormData.article_references;
    },
  },
  methods: {
    cancelDrawer() {
      this.$emit('cancelDrawer');
    },
    submitDrawer() {
      this.$emit('submitDrawer', this.drawerFormData);
    },
    handleTransferChange(newTargetKeys) {
      this.drawerFormData.article_references = newTargetKeys;
    },
  },
};
</script>
<style>
  .demo-drawer-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
  }
</style>

