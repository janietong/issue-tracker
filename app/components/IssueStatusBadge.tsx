import { Status } from '@prisma/client'
import { Badge } from '@radix-ui/themes'
import React from 'react'

const StatusMap: Record<Status, {label: string, color: 'red' | 'blue' | 'green'| 'bronze'}>= {
    OPEN: {label: 'Open', color:'green'},
    IN_PROGRESS: {label: 'In progress', color: 'blue'},
    CLOSED: {label: 'Closed', color: 'red'},
    CANCELLED: {label: 'Cancelled', color: 'bronze'}
}

const IssueStatusBadge = ({status} : {status: Status}) => {
  return (
    <Badge color={StatusMap[status].color}>
        {StatusMap[status].label}
    </Badge>
  )
}

export default IssueStatusBadge