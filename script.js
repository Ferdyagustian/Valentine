// ===== REFERENSI DOM ELEMENTS =====
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

// ✅ PERBAIKAN: Selector yang benar menggunakan "#p5" bukan "p#5"
const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");
const paper3 = document.querySelector("#p3");
const paper4 = document.querySelector("#p4");
const paper5 = document.querySelector("#p5");
const paper6 = document.querySelector("#p6");
const paper7 = document.querySelector("#p7");

const musicBtn = document.getElementById('music-btn');
const musicIcon = document.getElementById('music-icon');
const bgMusic = document.getElementById('bg-music');
const volumeSlider = document.getElementById('volume-slider');

// ===== STATE MANAGEMENT =====
let currentLocation = 1;
let numOfPapers = 7; 
let maxLocation = numOfPapers + 1;
let isPlaying = false;
let musicStartedByUser = false; // Track apakah musik sudah pernah diputar

// ===== INISIALISASI STATE AWAL =====
// Set state awal: buku tertutup di cover depan
book.classList.add('state-closed-start');

// ===== MUSIC CONTROLS =====

// Fungsi toggle Play/Pause
function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('music-playing');
        musicIcon.innerHTML = "🎵";
    } else {
        bgMusic.play().then(() => {
            musicBtn.classList.add('music-playing');
            musicIcon.innerHTML = "⏸";
            musicStartedByUser = true;
        }).catch(error => {
            console.log("Autoplay blocked:", error);
        });
    }
    isPlaying = !isPlaying;
}

// Event Listener Tombol Musik
musicBtn.addEventListener('click', toggleMusic);

// Volume Control
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 1000; // Convert 0-100 ke 0-1
    bgMusic.volume = volume;
});

// Set volume awal
bgMusic.volume = 0.005; // 50%

// ===== AUTO-START MUSIC SAAT INTERAKSI PERTAMA =====
function tryAutoStartMusic() {
    if (!musicStartedByUser && !isPlaying) {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicStartedByUser = true;
            musicBtn.classList.add('music-playing');
            musicIcon.innerHTML = "⏸";
        }).catch(error => {
            console.log("Autoplay dicegah browser. User harus klik tombol musik.");
        });
    }
}

// ===== NAVIGATION LOGIC =====

// ===== NAVIGATION LOGIC REVISED =====

function goNextPage() {
    if (currentLocation < maxLocation) {
        tryAutoStartMusic();
        
        // Pilih paper berdasarkan lokasi saat ini
        const currentPaper = document.querySelector(`#p${currentLocation}`);
        
        if (currentLocation === 1) {
            openBook();
        }

        if (currentLocation <= numOfPapers) {
            currentPaper.classList.add("flipped");
            // Z-index harus naik agar halaman yang baru dibalik berada di atas yang lama
            currentPaper.style.zIndex = currentLocation; 
        }

        // Jika sampai di halaman terakhir dan klik 'next'
        if (currentLocation === numOfPapers) {
            closeBook(false);
        }

        currentLocation++;
    }
}

function goPrevPage() {
    if (currentLocation > 1) {
        const prevPaperIndex = currentLocation - 1;
        const prevPaper = document.querySelector(`#p${prevPaperIndex}`);

        if (currentLocation === maxLocation) {
            openBook();
        }

        if (prevPaperIndex >= 1) {
            prevPaper.classList.remove("flipped");
            // Kembalikan z-index agar urutan tumpukan benar saat ditutup balik
            // Rumus: numOfPapers - index + 1
            prevPaper.style.zIndex = (numOfPapers - prevPaperIndex) + 1;
        }

        if (currentLocation === 2) {
            closeBook(true);
        }

        currentLocation--;
    }
}

// ===== BOOK ANIMATION HELPERS =====

function openBook() {
    // Hapus semua state class
    book.classList.remove('state-closed-start', 'state-closed-end');
    
    // Geser buku ke kanan agar spine berada di tengah layar
    if (window.innerWidth > 768) {
        book.style.transform = "translateX(50%)";
    } else {
        book.style.transform = "translateX(0%)";
    }
    book.style.transition = "transform 0.5s";
}

function closeBook(isAtBeginning) {
    if(isAtBeginning) {
        // STATE 1: Cover depan tertutup
        book.classList.add('state-closed-start');
        book.classList.remove('state-closed-end');
        book.style.transform = "translateX(0%)";
    } else {
        // STATE 3: Cover belakang tertutup
        book.classList.add('state-closed-end');
        book.classList.remove('state-closed-start');
        book.style.transform = "translateX(100%)";
    }
    book.style.transition = "transform 0.5s";
}

// ===== EVENT LISTENERS =====
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

// ===== RESPONSIVE HANDLING =====
window.addEventListener('resize', () => {
    // Update posisi buku jika window diresize
    if (currentLocation > 1 && currentLocation < maxLocation) {
        openBook();
    } else if (currentLocation === maxLocation) {
        closeBook(false);
    } else {
        closeBook(true);
    }
});
