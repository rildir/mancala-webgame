document.addEventListener('DOMContentLoaded', () => {
  let board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0]

  let history = []

  let currentPlayer = 'UserTwo'

  const pits = document.querySelectorAll('.pit')

  const playerDisplay = document.getElementById('playerDisplay')

  function updateBoard() {
    for (let i = 0; i < board.length; i++) {
      const pit = document.getElementById(`p${i}`)
      pit.innerHTML = ''
      const p13 = document.getElementById('p13')
      const p6 = document.getElementById('p6')

      if (!p13.querySelector('.avatar')) {
        let avatar = document.createElement('img')
        avatar.src = '/assets/images/berrak.webp'
        avatar.classList.add('avatar')
        avatar.style.position = 'absolute'
        p13.appendChild(avatar)
      }
      if (!p6.querySelector('.avatar')) {
        let avatar = document.createElement('img')
        avatar.src = '/assets/images/emir.webp'
        avatar.classList.add('avatar')
        avatar.style.position = 'absolute'
        p6.appendChild(avatar)
      }
      for (let j = 0; j < board[i]; j++) {
        let stone = document.createElement('img')
        stone.src = '/assets/images/tas.png'
        stone.classList.add('tas')
        pit.appendChild(stone)
      }

      let stoneCount = document.createElement('p')
      stoneCount.textContent = board[i] 
      stoneCount.classList.add('stone-count')
      pit.appendChild(stoneCount)

      if (board[i] === 0) {
        pit.style.pointerEvents = 'none'
      } else if (currentPlayer === 'UserOne' && i <= 5) {
        pit.style.pointerEvents = 'auto'
      } else if (currentPlayer === 'UserTwo' && i >= 7 && i <= 12) {
        pit.style.pointerEvents = 'auto'
      } else {
        pit.style.pointerEvents = 'none'
      }
    }

    // playerDisplay.textContent = `Sıra: ${currentPlayer}`
  }

  function checkGameEnd() {
    let berrakEmpty = true
    for (let i = 0; i < 6; i++) {
      if (board[i] !== 0) {
        berrakEmpty = false
        break
      }
    }

    let sendeEmpty = true
    for (let i = 7; i < 13; i++) {
      if (board[i] !== 0) {
        sendeEmpty = false
        break
      }
    }

    if (berrakEmpty || sendeEmpty) {
      if (berrakEmpty) {
        let sum = 0
        for (let i = 7; i < 13; i++) {
          sum += board[i]
          board[i] = 0
        }
        board[6] += sum
      }

      if (sendeEmpty) {
        let sum = 0
        for (let i = 0; i < 6; i++) {
          sum += board[i]
          board[i] = 0
        }
        board[13] += sum
      }

      updateBoard()

      let winner
      if (board[6] > board[13]) {
        winner = 'Emir'
      } else if (board[13] > board[6]) {
        winner = 'Berrak'
      } else {
        winner = 'Berabere'
      }

      alert('Oyun bitti! Kazanan: ' + winner)

      pits.forEach((pit) => (pit.style.pointerEvents = 'none'))
      return true
    }
    return false
  }

  function distributeStones(index) {
    history.push({ board: [...board], player: currentPlayer })

    if (
      board[index] === 0 ||
      (currentPlayer === 'UserOne' && index > 5) ||
      (currentPlayer === 'UserTwo' && index < 7)
    )
      return

    let stones = board[index] 

    board[index] = stones === 1 ? 0 : 1
    if (stones > 1) stones = stones - 1

    let position = index
    let lastPosition = null
    let landedInEmpty = false

    while (stones > 0) {
      position = (position + 1) % board.length

      if (
        (currentPlayer === 'UserOne' && position === 13) ||
        (currentPlayer === 'UserTwo' && position === 6)
      ) {
        continue
      }

      if (stones === 1 && board[position] === 0) {
        landedInEmpty = true
      }

      board[position]++
      stones--
      lastPosition = position
    }

    if (
      (currentPlayer === 'UserOne' && lastPosition === 6) ||
      (currentPlayer === 'UserTwo' && lastPosition === 13)
    ) {
      updateBoard()
      if (checkGameEnd()) return
      return
    }

    if (landedInEmpty) {
      let opposite = 12 - lastPosition
      if (board[opposite] > 0) {
        let captured = board[opposite] + board[lastPosition]
        board[opposite] = 0
        board[lastPosition] = 0
        if (currentPlayer === 'UserOne') {
          board[6] += captured
        } else {
          board[13] += captured
        }
      }
    } else if (
      (currentPlayer === 'UserOne' &&
        lastPosition >= 7 &&
        lastPosition <= 12 &&
        board[lastPosition] % 2 === 0) ||
      (currentPlayer === 'UserTwo' &&
        lastPosition >= 0 &&
        lastPosition <= 5 &&
        board[lastPosition] % 2 === 0)
    ) {
      if (currentPlayer === 'UserOne') {
        board[6] += board[lastPosition]
        board[lastPosition] = 0
      } else {
        board[13] += board[lastPosition]
        board[lastPosition] = 0
      }
    }

    currentPlayer = currentPlayer === 'UserOne' ? 'UserTwo' : 'UserOne'

    updateBoard()

    checkGameEnd()
  }

  function undo() {
    if (history.length > 0) {
      const lastMove = history.pop()
      board = lastMove.board
      currentPlayer = lastMove.player
      updateBoard()
    }
  }

  function restartGame() {
    board = [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0]

    history = []

    currentPlayer = 'UserTwo'

    updateBoard()

    pits.forEach((pit, index) => {
      if (currentPlayer === 'UserOne' && index <= 5) {
        pit.style.pointerEvents = 'all' 
      } else if (currentPlayer === 'UserTwo' && index >= 7 && index <= 12) {
        pit.style.pointerEvents = 'all'
      } else {
        pit.style.pointerEvents = 'none' 
      }
    })
  }

  document
    .getElementById('restartButton')
    .addEventListener('click', restartGame)

  pits.forEach((pit, index) => {
    pit.addEventListener('click', () => distributeStones(index))
  })

  updateBoard()

  document.getElementById('undoButton').addEventListener('click', undo)

    const infoButton = document.getElementById("infoButton");
    const modal = document.getElementById("infoModal");
    const closeButton = modal.querySelector(".close");

    infoButton.addEventListener("click", function () {
        modal.classList.add("show");
    });

    closeButton.addEventListener("click", function () {
        modal.classList.remove("show");
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });

  const muteButton = document.getElementById("muteButton");
  const muteIcon = document.getElementById("muteIcon");
  const audio = new Audio("/assets/voice/sungerbobsoundtrack.mp3");

  audio.volume = 0.2; 

  muteButton.addEventListener("click", function () {
      if (audio.paused) {
          audio.play();
          muteIcon.classList.replace("ph-speaker-x", "ph-speaker-high");
      } else {
          audio.pause();
          muteIcon.classList.replace("ph-speaker-high", "ph-speaker-x");
      }
  });
})
