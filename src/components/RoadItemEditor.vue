<template>
  <div>
    <Drawer
      title="修改"
      v-model="drawer"
      width="720"
      :mask-closable="false"
      :styles="styles"
    >
      <Form :model="formData">
        <h2>题目</h2> <br>
        <Row :gutter="32" style="margin-left: 0px; margin-right: 30px">
          <Col span="12">
              <Input v-model="formData.title" placeholder="请输入路书题目" >
              </Input>
          </Col>
        </Row>
        <br>
        <h2>标签</h2>
        <br>
        <Row :gutter="32" style="margin-left: 0px">
          <Col span="20">
            <Tag
              v-for="item in getTags()"
              :key="item.name"
              :name="item.name"
              :color="item.color"
              type="border"
              closable
              style='margin-left: 3px'
              @on-close="handleClose2">
              {{ item.name }}
            </Tag>
            <Button icon="ios-add" type="dashed" size="small" @click="handleAdd">添加标签</Button>
          </Col>
        </Row>
        <br>
        <h2>描述</h2>
        <br>
        <Row :gutter="50" style="margin-left: 20px; margin-right: 30px">
          <Input
            type="textarea"
            v-model="formData.note"
            :rows="4"
            placeholder="针对路书的描述" >
          </Input>
          </Row>
        <br>
        <h2>相关文献</h2>
        <br>
        <Row :gutter="50" style="margin-left: 20px">
        <Transfer
          :data="data2"
          :target-keys="targetKeys2"
          filterable
          :filter-method="filterMethod"
          @on-change="handleChange2"></Transfer>
        </Row>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="cancel">取消</Button>
        <Button type="primary" @click="onGenRoadMap">生成路书</Button>
      </div>
    </Drawer>
  </div>
</template>
<script>
export default {
  name: 'ItemEditor',
  props: ['drawer'],
  data() {
    return {
      // drawer: false,
      styles: {
        height: 'calc(100% - 55px)',
        overflow: 'auto',
        paddingBottom: '53px',
        position: 'static',
      },
      formData: {
        title: 'Development of learning-based Codec',
        note: '',
      },
      data2: this.getMockData(),
      targetKeys2: this.getTargetKeys(),
      // tags: this.getTags(),
    };
  },
  methods: {
    getTags() {
      const tags = [];
      tags.push({
        name: 'deep learning',
        color: 'cyan',
      });
      tags.push({
        name: 'codec',
        color: 'primary',
      });
      tags.push({
        name: '2020',
        color: 'purple',
      });
      return tags;
    },
    cancel() {
      this.$emit('cancelDrawer');
    },
    onGenRoadMap() {
      this.$router.push({ path: '/editor' });
    },
    getMockData() {
      const mockData = [];
      for (let i = 1; i <= 20; i += 1) {
        mockData.push({
          key: i.toString(),
          label: `paper ${i}`,
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
    handleAdd() {
      if (this.count.length) {
        this.count.push(this.count[this.count.length - 1] + 1);
      } else {
        this.count.push(0);
      }
    },
    handleClose2(event, name) {
      const index = this.count.indexOf(name);
      this.count.splice(index, 1);
    },
  },
};
</script>
<style>
  .demo-drawer-footer{
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

