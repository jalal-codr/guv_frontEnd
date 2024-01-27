import React from 'react'
import moment from 'moment';

function Comment({data}) {
  return (
    <>
      <div className="chat chat-start">
  <div className="chat-image avatar">
    <div className="w-10 rounded-full">
      <img alt="Tailwind CSS chat bubble component" src={data.userImg} />
    </div>
  </div>
  <div className="chat-header">
    {data.from}
  </div>
  <div className="chat-bubble">{data.comment}</div>
  <div className='time_div_comm'>
  <time className="text-xs opacity-50">{moment(data.updatedAt).format('MMMM Do YYYY')}</time>
  </div>
  
</div>
    </>
  )
}

export default Comment
