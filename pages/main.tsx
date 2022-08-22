import type { NextPage } from 'next'
import Head from 'next/head'
import { useState, ChangeEvent, FormEvent } from 'react'
import { isKanji } from '../utils/isKanji'
const Main: NextPage = () => {
  const [words, setWords] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [info, setInfo] = useState<{ meaning: string | null; reading: string | null; byFinding: boolean }[]>([])
  const [currentWord, setCurrentWord] = useState<string>("")
  const [isError, setIsError] = useState<string | null>(null)
  const [isNotFound, setIsNotFound] = useState(false)

  // const [players, setPlayers] = useState<>()

  // useEffect(() => {
  //   if (isError) {
  //     setTimeout(() => { setIsError(null) }, 5000)
  //   }
  // }, [isError])

  const handleTyping = (x: ChangeEvent<HTMLInputElement>): void => {
    setCurrentWord(x.target.value)
    if (isError != null) setIsError(null)
  }

  const handleFind = () => {
    setIsLoading(true)
    let isOkay = false;
    let meaning: string | null = null;
    let reading: string | null = null;
    let kanji: string | null = null;
    const param = words.length == 0 ? '' : words[words.length - 1]

    const usedKanji = words.length == 0 ? '' : words.join(",")

    fetch(`/api/find?word=${param}&used=${usedKanji}`).then((res) => res.json()).then((res) => {
      isOkay = res.OK
      meaning = res.meaning
      reading = res.reading
      kanji = res.kanji

      if (isOkay && meaning != null && kanji) {

        setWords([...words, kanji]);
        setInfo([...info, { meaning: meaning, reading: reading, byFinding: true }]);
        setIsLoading(false)
        setCurrentWord(kanji[kanji.length - 1])
      }
      else {
        setIsNotFound(true)
        setIsLoading(false)
      }
    })
  }

  const handleSubmit = (event: FormEvent) => {

    setIsLoading(true)
    let valid = true
    let reason = null
    event.preventDefault();


    if (!isKanji(currentWord)) {
      valid = false
      reason = "The word must consist of kanji only"
    }
    else if (currentWord.length <= 1) {
      valid = false
      reason = "The kanji must consist of more than 1 letter"
    }

    if (valid && words.length > 0) {
      const lastWord = words[words.length - 1]
      if (lastWord[lastWord.length - 1] != currentWord[0]) {
        valid = false
        reason = "The last letter of the last kanji and the first letter of current kanji does not match"
      }
      if (words.lastIndexOf(currentWord) != -1) {
        valid = false
        reason = "This kanji is already used"
      }
    }

    let isOkay = false;
    let meaning: string | null = null;
    let reading: string | null = null;

    if (valid) {
      fetch(`/api/check?word=${currentWord}`).then((res) => res.json()).then((res) => {
        isOkay = res.OK
        meaning = res.meaning
        reading = res.reading

        if (isOkay && meaning != null) {
          setWords([...words, currentWord]);
          setInfo([...info, { meaning: meaning[0], reading: reading, byFinding: false }]);
          setIsLoading(false)
          setCurrentWord(currentWord[currentWord.length - 1])
        }

        else {
          reason = "Cannot find this kanji"
          setIsLoading(false)
          setIsError(reason)
        }
      })
    }
    else {
      setIsLoading(false)
      setIsError(reason)
    }

  }
  return (
    <div className="flex w-screen min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-green-300">
      <Head>
        <title>Kanji's jikan</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <main className="relative flex max-w-lg w-full min-h-screen pb-40 pt-10 flex-col items-center justify-center px-4 text-center gap-10">
        {/* <div className='absolute top-3 right-3 bg-white px-2 rounded shadow-md text-sm w-18 text-center'>Hide Meaning</div> */}
        <div className='flex flex-col w-full shadow-lg rounded-md overflow-hidden'>
          {/* <thead>
            <tr>
              <th>感じ</th>
              <th>意味</th>
            </tr>
          </thead> */}

          {words.map((word: String, idx: number) => {
            return <div className={`bg-white flex justify-center h-full items-center w-full  ${idx != words.length - 1 && 'border-b'} pr-2`}>

              <div className={`border-r-2 ${idx == 0 && 'rounded-tl-md'} ${idx == words.length - 1 && 'rounded-bl-md'} text-sm ${info[idx].byFinding ? 'bg-red-400 border-red-500' : 'bg-blue-600 border-blue-700 '} text-white w-6 h-8 text-center align-middle flex items-center justify-center relative`}>
                <span className=''>{idx + 1}</span>
              </div>
              <div className='border-r w-1/4 my-1 whitespace-nowrap overflow-x-scroll'>{word} </div>
              <div className='border-r w-1/4 my-1 whitespace-nowrap overflow-x-scroll'>{info[idx].reading}</div>
              <div className='w-1/2 my-1 whitespace-nowrap overflow-x-scroll px-2' >{info[idx].meaning}</div>
            </div>
          })}



        </div>
        {words.length == 0 && <div className='text-white text-md font-bold'>Type Something To Begin ⬇️</div>}
      </main>

      <div className=' bg-white flex flex-col h-32 border-t w-full fixed bottom-0 pt-2 items-center justify-center'>
        {/* <div className='absolute right-0 -top-6 rounded-t-md shadow-inner  bg-white px-2 h-6 border-2 pb-1 text-sm'>⚙️</div> */}
        <div className='text-sm top-2 h-10 absolute flex flex-col justify-center items-center w-full'>
          {isLoading && <span className=''>Checking</span>}
          {isError != null && <span className='text-red-500 w-4/5 text-center'>{isError}</span>}
          {isNotFound && <span className='text-red-500'>The kanji cannot be found</span>}
        </div>


        <form className='gap-1 flex' onSubmit={handleSubmit}>
          {words.length > 0 && <button disabled={isLoading} type='button' className='rounded-md border px-4 border-black' onClick={handleFind}>Find</button>}
          <input type="text" placeholder={words.length > 0 ? words.slice(-1)[0].slice(-1) : 'Type kanji here'} className={`border rounded-md pl-2 ${isError ? 'border-red-500' : 'border-black'}`} value={currentWord.toString()} onChange={handleTyping} />
          <button disabled={isLoading} type='submit' className={` rounded-md border px-4 border-black`} onClick={handleSubmit}>Enter</button>

        </form>
      </div>

      {/* <footer className="flex h-24 w-full items-center justify-center border-t">

      </footer> */}
    </div >
  )
}

export default Main
