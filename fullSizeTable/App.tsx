import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from "@dnd-kit/sortable";
import { Table, TableColumnsType } from "antd";
import { useState } from "react";
import FullsizeTable from "./components/fullSizeTable";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    key: 'sort'
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    width: 80,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    width: '100%'
  },
]

function App() {
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address:
        'Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ])

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };
  return (
    <>
      <FullsizeTable
        onDragEnd={onDragEnd}
        table={
          <Table
            dataSource={dataSource}
            columns={columns}
            rowKey="key"
            pagination={false}
            bordered
          />
        }
      />
    </>
  )
}

export default App;