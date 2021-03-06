import * as qs from 'qs'
import React, { useState, useEffect } from 'react'
import { List } from './list'
import { SearchPanel } from './search-panel'
import { cleanObject } from '../../utils'

const apiUrl = process.env.REACT_APP_API_URL

export const ProjectList = () => {
  const [param, setParam] = useState({
    name: '',
    personId: ''
  })
  const [users, setUsers] = useState([])
  const [list, setList] = useState([])

  /* 获取负责人列表 */
  useEffect(() => {
    fetch(`${apiUrl}/users`)
      .then(async res => {
        if (res.ok) {
          setUsers(await res.json())
        }
      })
  }, [])

  /* 获取列表 */
  useEffect(() => {
    fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(param))}`)
    .then(async res => {
      if (res.ok) {
        setList(await res.json())
      }
    })
  }, [param])

  return <div>
    <SearchPanel param={param} setParam={setParam} users={users} />
    <List list={list} users={users} />
  </div>
}
