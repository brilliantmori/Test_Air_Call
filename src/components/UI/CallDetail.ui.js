import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import {
  CallDetailBoxStyle,
  CallFromStyle,
  CallViaStyle,
  ArchiveUndoStyle,
  CallFromWrappedStyle,
  CallDetailDateStyle,
  DurationStyle,
  UndoStyle,
  ArchiveIcon,
} from './style'

import { useUpdateCallMutation } from '../../store/api'
import { updateCallList } from '../../store/call.reducer'
import { CallIcon, CallFrom, CallVia } from './CallBox.ui'

export const CallDetail = ({
  id,
  date,
  from,
  to,
  callType,
  isArchived,
  via,
  direction,
  duration,
}) => {
  console.log('isArchived', isArchived)
  const [ archived, setArchived ] = useState(isArchived)
  const [ updateCall ] = useUpdateCallMutation()

  let newDate = new Date(date)
  let dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  let timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }
  let formatDate = new Intl.DateTimeFormat('en-US', dateOptions)
  let formatTime = new Intl.DateTimeFormat('en-US', timeOptions)
  let shortDate = formatDate.format(newDate)
  let fullTime = formatTime.format(newDate)
  let time = fullTime.match(/[\d:]+/)
  let ampm = fullTime.match(/PM|AM/)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleArchiveOrUndo = async () => {
    const state = {
      is_archived: !archived,
    }
    setArchived(!archived)
    await updateCall({ id, state })
    dispatch(updateCallList({ id, state }))
  }

  const handleClick = () => {
    navigate(`/detail/${id}`)
  }

  useMemo(() => {
    setArchived(isArchived)
  }, [ isArchived ])
  return (
    <CallDetailBoxStyle onClick={handleClick}>
      <CallFromWrappedStyle>
        <CallIcon callType={callType} direction={direction} />
        <CallFromStyle>
          <CallFrom direction={direction} to={to} from={from} />
        </CallFromStyle>
      </CallFromWrappedStyle>

      <CallViaStyle>
        <CallVia via={via} />
      </CallViaStyle>

      <CallDetailDateStyle>
        <span id="time"> {time} </span>
        <span id="ampm"> {ampm} </span>
        <span> {shortDate}</span>
      </CallDetailDateStyle>

      <DurationStyle>
        <span>Duration: </span>
        {duration}
        <span>s</span>
      </DurationStyle>

      <ArchiveUndoStyle onClick={handleArchiveOrUndo}>
        {archived ? <UndoStyle size="30" /> : <ArchiveIcon style={{ minWidth: '30px' }} />}
      </ArchiveUndoStyle>
    </CallDetailBoxStyle>
  )
}
