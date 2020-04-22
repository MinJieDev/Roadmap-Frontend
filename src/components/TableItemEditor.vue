<template>
  <div>
    <Drawer
      title="Create"
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
                v-model="getFormData().title"
                clearable
                placeholder="please enter user name">
              </Input>
            </Col>
          </Row>
        </Col>

        <Col span="12">
          <h3>链接(URL)</h3>  <br>
          <Row :gutter="50" style="margin-left: 20px">
            <Input
              v-model="getFormData().url"
              clearable
              placeholder="please enter url">
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
          v-model="getFormData().note"
          :rows="4"
          clearable
          placeholder="please enter the description">
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
    data: {
      type: Array,
      required: true,
    },
    drawer: {
      type: Boolean,
    },
    index: {
      type: Number,
      default: -1,
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
      formData: {
        title: '',
        url: '',
        note: '',
      },
    };
  },
  methods: {
    cancelDrawer() {
      this.$emit('cancelDrawer');
    },
    submitDrawer() {
      // add api to submit data
      this.$emit('cancelDrawer');
    },
    getFormData() {
      if (this.data[this.index] === undefined) {
        this.formData.title = '';
        this.formData.url = '';
        this.formData.note = '';
        return this.formData;
      }
      this.formData.title = this.data[this.index].title;
      this.formData.url = this.data[this.index].url;
      this.formData.note = this.data[this.index].note;
      return this.formData;
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

