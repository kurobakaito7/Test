
import { MenuOutlined } from '@ant-design/icons'
import { DndContext } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pagination, Spin } from 'antd'
import { any, array, element } from 'prop-types'
import { Children, cloneElement, useEffect, useMemo, useState } from 'react'
import { useWindowSize } from 'react-use'
import PropTypes from 'prop-types'

interface RowProps {
  children: React.ReactNode
  style: React.CSSProperties
  'data-row-key'?: string
}

export const Row: React.FC<RowProps> = ({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: props['data-row-key'] || ''
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1
      }
    ),
    transition,
    ...(isDragging
      ? {
          position: 'relative',
          zIndex: 9
        }
      : {})
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {Children.map(children, (child) => {
        if (child.key === 'sort') {
          return cloneElement(child, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{
                  touchAction: 'none',
                  cursor: 'move'
                }}
                {...listeners}
              />
            )
          });
        }
        return child;
      })}
    </tr>
  );
};

interface FullsizeTableProps {
    btns?: React.ReactNode[];
    table: React.ReactElement;
    defaultPageSize?: number;
    onDragEnd?: (event) => void;
    getPagination?: null | ((current: number, pageSize: number) => void);
  }
  
  const FullsizeTable: React.FC<FullsizeTableProps> = ({
    btns,
    table,
    defaultPageSize, // 需要传入默认页数了
    onDragEnd,
    getPagination = null
  }) => {
    const { height } = useWindowSize();
    const [total, setTotal] = useState<number>(-1);
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(defaultPageSize || 10);
    const [newTable, setNewTable] = useState<React.ReactElement>();
  
    const rowKey = useMemo(() => table.props.rowKey, [table.props.rowKey]);
    
  
    const dataSource = useMemo(() => {
      return table.props.dataSource.slice((current - 1) * pageSize, current * pageSize)
    }, [current, pageSize, table.props.dataSource]);
  
    useEffect(() => {
      setNewTable(
        cloneElement(table, {
          ...table.props,
          pagination: false,
          bordered: true,
          scroll: {
            x: 'max-content',
            scrollToFirstRowOnChange: true,
            y: height - 172
          },
          dataSource,
          components: { body: { row: Row } }
        })
      );
    }, [height, table, dataSource]);
  
    useEffect(() => {
      setTotal(table.props.dataSource.length);
    }, [table.props.dataSource.length]);
  
    useEffect(() => {
      setCurrent(1);
    }, [pageSize]);
  
    if (total < 0) return <Spin />;
  
    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            padding: '4px 0 7px 8px',
            width: '100%',
            flexWrap: 'nowrap',
            lineHeight: 1,
            marginRight: '8px'
          }}
        >
          {btns &&
            btns
              .filter((i) => i)
              .map((btn) => (
                <div style={{ marginRight: 8, flexShrink: 0 }} key={btn.key}>
                  {btn}
                </div>
              ))}
          {
            <Pagination
              style={{ marginLeft: 'auto', flexShrink: 0 }}
              hideOnSinglePage
              showQuickJumper
              total={total}
              current={current}
              pageSize={pageSize}
              onChange={(current) => {
                  setCurrent(current);
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  getPagination && getPagination(current, pageSize);
              }}
              onShowSizeChange={(_, size) => {
                setPageSize(size);
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                getPagination && getPagination(current, size);
              }}
            />
          }
        </div>
        {onDragEnd ? (
          <DndContext onDragEnd={onDragEnd}>
            <SortableContext
              items={dataSource.map((item) => item[rowKey])}
              strategy={verticalListSortingStrategy}
            >
              {newTable}
            </SortableContext>
          </DndContext>
        ) : (
          newTable
        )}
      </>
    );
  };
  
  // 用ts静态检测嘛,这行代码不要了
  FullsizeTable.propTypes = {
    btns: array.isRequired,
    table: element.isRequired,
    onDragEnd: PropTypes.func,
    defaultPageSize: PropTypes.number,
    getPagination: any
  };
  
  export default FullsizeTable;