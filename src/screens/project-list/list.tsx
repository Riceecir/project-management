import React from 'react'
import { User } from './search-panel'

interface Project {
  id: number,
  name: string,
  personId: number,
  organization: string
}

interface ListProps {
  list: Project[],
  users: User[]
}

export const List = ({ list, users }: ListProps) => {
  return (<table>
    <thead>
      <tr>
        <th>名称</th>
        <th>负责人</th>
      </tr>
    </thead>

    <tbody>
      {
        list.map((project, i) => <tr key={i + ''}>
          <td>{project.name}</td>
          <td>{users.find(user => user.id === project.personId)?.name || ''}</td>
        </tr>)
      }
    </tbody>
  </table>)
}
