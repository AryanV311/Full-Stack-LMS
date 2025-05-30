import React from 'react'
import { Outlet } from 'react-router-dom'

export const Educator = () => {
  return (
    <div>
        <p>Educatore</p>

        <div>
            {
                <Outlet />
            }
        </div>

    </div>
  )
}
