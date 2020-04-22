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
      <Row :gutter="32">
        <Col span="10">
          <h3>题目</h3> <br>
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

        <Col span="12">
          <h3>链接(URL)</h3>  <br>
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
          :data="data2"
          :target-keys="targetKeys2"
          filterable
          :filter-method="filterMethod"
          @on-change="handleChange2"></Transfer>
      </Row>

      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="cancelDrawer">取消</Button>
        <Button type="primary" @click="submitDrawer">提交修改</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
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
      data2: this.getMockData(),
      targetKeys2: this.getTargetKeys(),
    };
  },
  methods: {
    cancelDrawer() {
      this.$emit('cancelDrawer');
    },
    submitDrawer() {
      this.$emit('submitDrawer');
    },
    getMockData() {
      const mockData = [];
      for (let i = 1; i <= 20; i += 1) {
        mockData.push({
          key: i.toString(),
          label: `Content ${i}`,
          description: `The desc of content  ${i}`,
          disabled: Math.random() * 3 < 1,
        });
      }
      return mockData;
    },
    getTargetKeys() {
      return this.getMockData()
        .filter(() => Math.random() * 2 > 1)
        .map(item => item.key);
    },
    handleChange2(newTargetKeys) {
      this.targetKeys2 = newTargetKeys;
    },
    filterMethod(data, query) {
      return data.label.indexOf(query) > -1;
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

