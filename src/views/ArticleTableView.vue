<template>
  <div>
    <MindTable :data="tableData"/>
  </div>
</template>

<script>
import MindTable from '../components/MindTable';

export default {
  name: 'ArticleTableView',
  components: { MindTable },
  data() {
    return {
      tableData: [
        {
          id: '100',
          title: 'python',
          url: 'http://www.wikiwand.com/en/Python_(programming_language)',
          note: 'Hello Python',
          children: [
            {
              id: '10000',
              title: 'source',
              url: 'https://github.com/python/cpython',
              note: 'original python implementation in c,compiles python code into byte code and interprets the byte code in a evaluation loop',
            },
          ],
        },
        {
          id: '101',
          title: 'help',
          url: 'https://github.com/vinta/awesome-python',
          note: 'awesome python',
        }],
    };
  },
};
</script>

<style scoped>

</style>
