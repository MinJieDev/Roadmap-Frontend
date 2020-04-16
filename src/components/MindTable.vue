<template>
  <Table row-key="id"
         :columns="columns"
         :data="data"
         border></Table>
</template>
<script>
export default {
  name: 'MindTable',
  data() {
    return {
      columns: [
        {
          title: 'Title',
          key: 'title',
          tree: true,
        },
        {
          title: 'Url',
          key: 'url',
        },
        {
          title: 'Note',
          key: 'note',
        },
      ],
      data: [
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
              note: 'original python implementation in c, compiles python code into byte code and interprets the byte code in a evaluation loop',
            },
          ],
        },
        {
          id: '101',
          title: 'help',
          url: 'https://github.com/vinta/awesome-python',
          note: 'awesome python',
        },
      ],
    };
  },
};
</script>


<style scoped>

</style>
