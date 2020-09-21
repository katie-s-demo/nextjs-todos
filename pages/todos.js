import { useState } from 'react';
import { Layout, Row, Col, Button, Input, Checkbox, Card, Divider } from 'antd';
import { CheckCircleTwoTone, ClockCircleTwoTone, SmileTwoTone, HeartTwoTone, MehTwoTone, FrownTwoTone, ExclamationCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons'

import Styles from '../styles/todos.module.scss';

const { Header, Footer, Sider, Content } = Layout;
const { Meta } = Card

async function getTodoList() {
    const res = await fetch('http://127.0.0.1:3001/todos');
    const todoList = await res.json()
    return { todoList }
}

async function addTodo(todo) {
    const res = await fetch('http://127.0.0.1:3001/todos', {
        method: 'POST',
        body: JSON.stringify(todo), // data can be `string` or {object}!
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    const { success } = await res.json()
    return { isCreated: success }
}

async function updateTodo(todo) {
    const res = await fetch(`http://127.0.0.1:3001/todos/${todo._id}`, {
        method: 'PUT',
        body: JSON.stringify(todo), // data can be `string` or {object}!
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    const updatedItem = res.json()
    return updatedItem
}

async function deleteTodo(id) {
    const res = await fetch(`http://127.0.0.1:3001/todos/${id}`, {
        method: 'DELETE'
    })
    const { success } = await res.json()
    return { isDeleted: success }
}
export default function Todo({ todoList }) {
    const [todos, setTodos] = useState(todoList);
    const [newTask, setNewTask] = useState('')

    function onStatusChange(item, e) {
        e.preventDefault();
        updateItem(Object.assign(item, { status: 'complete' === item.status ? 'pending' : 'complete' }))
    }

    function onTaskChange(item, e) {
        e.preventDefault();
        updateItem(Object.assign(item, { task: e.target.value }))
    }
    async function createItem(e) {
        if (!newTask) return;
        let { isCreated } = await addTodo({
            status: 'in progress',
            task: newTask
        })
        if (isCreated) {
            setNewTask('')

            let newProps = await getTodoList()
            setTodos(newProps.todoList)
        }
    }

    async function updateItem(todo) {
        if (!todo._id) return;
        let newItem = await updateTodo(todo)
        if (newItem && newItem._id) {
            let newTodoList = [...todos]
            newTodoList.map((itm) => {
                if (newItem._id === itm._id) {
                    itm = newItem
                }
            })
            setTodos(newTodoList)
        }
    }

    async function removeItem(todo) {
        if (!todo._id) return;
        let { isDeleted } = await deleteTodo(todo._id)
        if (isDeleted) {
            let newProps = await getTodoList()
            setTodos(newProps.todoList)
        }
    }

    return (
        <Layout className={Styles.Todos}>
            <Header>
                <Row>
                    <Col span={4} offset={11}>TODO List</Col>
                </Row>
            </Header>
            <Content>
                <Row gutter={16} className={Styles.add}>
                    {/* <Col span={6} offset={7}>
                        <Input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                    </Col>
                    <Col span={6}>
                        <Button type="primary" onClick={createItem}>添加</Button>
                    </Col> */}
                    <Col span={8} offset={8}>
                        <Input placeholder={'+ Add Todo'} value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyUp={(e) => (13 == e.keyCode && createItem())} />
                    </Col>
                    
                </Row>
                {/* <ul>
                {todos.map((todo, index) => (
                    <li key={todo._id}>
                        <Row >
                            <Checkbox checked={'complete' == todo.status} onChange={(e) => onStatusChange(todo, e)}><span>{todo.task}</span></Checkbox>
                            <span>{todo.status}</span>
                            <Button type="primary" onClick={(e) => removeItem(todo)}>删除</Button>
                        </Row>
                    </li>
                ))}
                </ul> */}
                <Row gutter={[16, 24]}>
                    {todos.map((todo, index) => (
                        <Col span={8} offset={8}>
                            <Card bodyStyle={{padding: '12px'}}>
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <Checkbox className={'complete' == todo.status && Styles.completed}
                                          checked={'complete' == todo.status}
                                          onChange={(e) => onStatusChange(todo, e)}>
                                    <span className={Styles['task-name']}>{todo.task}</span>
                                    {'complete' == todo.status && (
                                        <span>
                                            <SmileTwoTone />
                                            <HeartTwoTone twoToneColor="#eb2f96" />
                                            <CheckCircleTwoTone twoToneColor="#52c41a" />
                                        </span>
                                    )}
                                    {'in progress' == todo.status && (
                                        <span>
                                            <MehTwoTone />
                                            <ClockCircleTwoTone />
                                        </span>
                                    )}
                                    {'pending' == todo.status && (
                                        <span>
                                            <FrownTwoTone />
                                            <ExclamationCircleTwoTone twoToneColor="#f8a12f" />
                                        </span>
                                    )}
                                </Checkbox>
                                    <CloseCircleOutlined style={{fontSize: '16px', cursor: 'pointer'}} onClick={(e) => removeItem(todo)} />
                                </div>
                            </Card>
                            
                        </Col>
                    ))}
                </Row>
            </Content>
        </Layout>
    )
}

Todo.getInitialProps = getTodoList;

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
// export async function getStaticProps() {
//     // Call an external API endpoint to get todos.
//     // You can use any data fetching library
//     const res = await fetch('http://127.0.0.1:3001/todos')
//     const todoList = await res.json()

//     // By returning { props: todos }, the Blog component
//     // will receive `todos` as a prop at build time

//     return {
//         props: {
//             todoList,
//         },
//     }
// }