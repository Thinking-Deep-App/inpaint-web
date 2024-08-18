/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react'
import { useClickAway } from 'react-use'
import FileSelect from './components/FileSelect'
import Modal from './components/Modal'
import Editor from './Editor'
import { resizeImageFile } from './utils'
import Progress from './components/Progress'
import { downloadModel } from './adapters/cache'
import * as m from './paraglide/messages'

function App() {
  const [file, setFile] = useState<File>()
  const query = new URLSearchParams(window.location.search)
  const inpaintType = query.get('type') || 'rmbg'

  const [showAbout, setShowAbout] = useState(false)
  const modalRef = useRef(null)

  const [downloadProgress, setDownloadProgress] = useState(100)

  useEffect(() => {
    downloadModel('inpaint', setDownloadProgress)
  }, [])

  useClickAway(modalRef, () => {
    setShowAbout(false)
  })

  async function startWithDemoImage(img: string) {
    const imgBlob = await fetch(`/examples/${img}.jpeg`).then(r => r.blob())
    setFile(new File([imgBlob], `${img}.jpeg`, { type: 'image/jpeg' }))
  }

  return (
    <div className="min-h-full flex flex-col">
      <main
        style={{
          height: 'calc(100vh - 56px)',
        }}
        className=" relative"
      >
        {file ? (
          <Editor
            file={file}
            onBack={() => setFile(undefined)}
            inpaintType={inpaintType}
          />
        ) : (
          <>
            <div className="flex h-full flex-1 flex-col items-center justify-center overflow-hidden">
              <div className="h-72 sm:w-1/2 max-w-5xl">
                <FileSelect
                  onSelection={async f => {
                    const { file: resizedFile } = await resizeImageFile(
                      f,
                      1024 * 4
                    )
                    setFile(resizedFile)
                  }}
                />
              </div>
              <div className="flex flex-col sm:flex-row pt-10 items-center justify-center cursor-pointer">
                <span className="text-gray-500">{m.try_it_images()}</span>
                <div className="flex space-x-2 sm:space-x-4 px-4">
                  {['bag', 'dog', 'car', 'bird', 'jacket', 'shoe', 'paris'].map(
                    image => (
                      <div
                        key={image}
                        onClick={() => startWithDemoImage(image)}
                        role="button"
                        onKeyDown={() => startWithDemoImage(image)}
                        tabIndex={-1}
                      >
                        <img
                          className="rounded-md hover:opacity-75 w-auto h-25"
                          src={`examples/${image}.jpeg`}
                          alt={image}
                          style={{ height: '100px' }}
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {showAbout && (
        <Modal>
          <div ref={modalRef} className="text-xl space-y-5">
            <p>
              {' '}
              任何问题到:{' '}
              <a
                href="https://github.com/lxfater/inpaint-web"
                style={{ color: 'blue' }}
                rel="noreferrer"
                target="_blank"
              >
                Inpaint-web
              </a>{' '}
              反馈
            </p>
            <p>
              {' '}
              For any questions, please go to:{' '}
              <a
                href="https://github.com/lxfater/inpaint-web"
                style={{ color: 'blue' }}
                rel="noreferrer"
                target="_blank"
              >
                Inpaint-web
              </a>{' '}
              to provide feedback.
            </p>
          </div>
        </Modal>
      )}
      {!(downloadProgress === 100) && (
        <Modal>
          <div className="text-xl space-y-5">
            <p>{m.inpaint_model_download_message()}</p>
            <Progress percent={downloadProgress} />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default App
