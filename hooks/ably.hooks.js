import { useState, useEffect } from 'react'
import { ably } from '../env'


export const useAblyChannel = (channel, dependencies) => {
  //set HUB_STREAM  channel
  const HUB_STREAM =
    '[product:ably-flightradar24/heathrow-flights]flights:airport:LHR'

  const [onMessage, setOnMessage] = useState('Please wait..')

  const [isLoading, setLoading] = useState(true)
  //fetch channel data
  const [channelData, setChannelData] = useState(null)

  useEffect(() => {
    console.log('Ran Use Effects', channel)
    ably.connection.on(function(stateChange) {
      console.log('New connection state is ' + stateChange.current)
      setOnMessage(stateChange.current)
      setLoading(true)
    })

    const useChannel = ably.channels.get(`${HUB_STREAM}:${channel}`)
    useChannel.subscribe(message => {
      if (message.data.length > 0) {
        setOnMessage('Loading Data...')
        setLoading(false)
        setChannelData(message.data)
      }
    })
  }, dependencies)

  return [isLoading, onMessage, channelData]
}
