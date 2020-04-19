<template>
  <div>
    <Button @click="drawer = true" type="primary">Create</Button>
    <Drawer
      title="Create"
      v-model="drawer"
      width="720"
      :mask-closable="false"
      :styles="styles"
    >
      <Form :model="formData">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="Title" label-position="top">
              <Input v-model="formData.name" placeholder="please enter user name" >
              </Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="Url" label-position="top">
              <Input v-model="formData.url" placeholder="please enter url">
                <span slot="prepend">http://</span>
              </Input>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="Note" label-position="top">
          <Input
            type="textarea"
            v-model="formData.desc"
            :rows="4"
            placeholder="please enter the description" >
          </Input>
        </FormItem>
        <Transfer
          :data="data2"
          :target-keys="targetKeys2"
          filterable
          :filter-method="filterMethod"
          @on-change="handleChange2"></Transfer>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="cancel">Cancel</Button>
        <Button type="primary" @click="cancel">Submit</Button>
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
        title: '',
        url: '',
        note: '',
      },
      data2: this.getMockData(),
      targetKeys2: this.getTargetKeys(),
    };
  },
  methods: {
    cancel() {
      this.$emit('cancelDrawer');
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

