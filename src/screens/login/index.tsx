import React, { FormEvent } from 'react'

export const Login = () => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">用户名</label>
        <input type="text" id={'username'}/>
      </div>

      <div>
        <label htmlFor="password">密码</label>
        <input type="password" id={'password'}/>
      </div>

      <button type="submit">登录</button>
    </form>
  )
}