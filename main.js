const $cardListWrap = document.getElementById("m_list_wrap");
const $searchInput = document.getElementById('search-input');
const $searchBtn = document.getElementById('searchBtn');
const $refreshBtn = document.getElementById('refreshBtn');

const $modal = document.getElementById("modal");
const $modalCnt = document.getElementById("modalCnt");
const $movieTitle = document.getElementById("movieTitle");
const $movieOverview = document.getElementById("movieOverview");
const $movieRating = document.getElementById("movieRating");
const $closeModal = document.getElementById("closeModal");


const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MGI2YTY4OWQ1NTMwNTAyYmQ3MmVlNjY4NWJlMDUzOCIsInN1YiI6IjY0ZmUzOGZjYzNiZmZlMDEwMTI5NDAwMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WxRRqtG5TE7NPS7X8Pfn100g3ozzHAiLzN_WB8g1HS4'
    }
};

fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    .then(res => res.json())
    .then(res => {
        const result = res['results'];
        // console.log(result);

        // 1) 홈페이지 접속 시 전체 영화 리스트 가져오기
        const movieMaker = (movieImg, movieTitle, movieOverview, movieRate) => { // 영화 정보를 가져와서 카드형태로 html에 구현하는 함수

            let temp_html = `
            <div class="img_wrap">
                <img src="https://image.tmdb.org/t/p/w500/${movieImg}" alt="movie_img">
            </div>
            <p class="movie_title">${movieTitle}</p>
            <p style="color: white;">${movieOverview}</p>
            <p style="color: yellow;">[MovieRate] ${movieRate}</p>
            `;

            return temp_html
        };
        movieData(result);

        // 카드의 고유 id 값을 넣어줘야함.

        function movieData(result) { // 영화 정보를 가져오는 함수
            result.forEach(el => {

                let movieTitle = el['title'];
                let movieImg = el['poster_path'];
                let movieID = el['id'];
                let movieRate = el['vote_average'];
                let movieOverview = el['overview'];
                let movieBackImg = el['backdrop_path'];

                const listItem = document.createElement('li');
                listItem.classList.add('m_list'); // 생성한 li에 class 값 추가 
                listItem.setAttribute("data-movie-id", movieID); // data-로 시작되는 속성을 추가 할 수 있음. (표준 HTML 규격이라고..)
                listItem.innerHTML = movieMaker(movieImg, movieTitle, movieOverview, movieRate);

                $cardListWrap.appendChild(listItem);
            });
        };

        // 2) 각 영화를 클릭하면, 영화 추가 이미지, 제목, id, 줄거리, 평점 나오게하기 
        //     x 창을 누르거나 모달창 밖을 누르면 모달창에서 나오기
        // 2-1) 각 카드를 누르면 모달창 뜨기
        // 2-2) 모달창 외 영역을 누르면 닫기



        // 문제 되었던 코드
        // $cardListWrap.addEventListener('click', (event) => {
        //     const target = event.target;
        //     console.log(target);
        //     if (target.classList.contains('m_list')) {
        //         const movieId = target.getAttribute('data-movie-id');

        //         alert("선택한 영화 ID : " + movieId);
        //     }
        // })


        $cardListWrap.addEventListener('click', (event) => {
            const clickedCard = event.target.closest('.m_list'); // 클릭된 카드 요소 가져오기 -> 클릭 시 부모 요소를 찾는 메서드 ... 
            const clickMovieID = clickedCard.getAttribute('data-movie-id'); // 클릭된 카드의 data-movie-id 속성 값 가져오기

            alert("선택한 영화 ID: " + clickMovieID); // 해당 ID를 알림 창으로 표시
        });



        // 3) 검색기능을 통해 영화 이름으로 검색하기 
        let searchList = [];

        $searchInput.addEventListener('input', () => {
            const value = $searchInput.value.toLowerCase();
            searchList = result.filter(item => {
                const m_title = item.title.toLowerCase();
                return m_title.includes(value) ? item : "";
            });
            console.log(searchList);  // 검색 후 검색단어를 지워도 value 안에 데이터가 자동으로 저장됨
        });

        let performSearch = () => {

            if (typeof $searchInput.value == null || $searchInput.value == "undefined" || $searchInput.value == "") { // 타입 검사를 searchList로 하여 동일한 문제 지속..
                alert('검색어를 다시 입력해 주세요!');
                $searchInput.value = "";
                $searchInput.focus();
                return;
            } else {
                $cardListWrap.innerHTML = '';
                alert(`${$searchInput.value} 를 검색한 결과 입니다.`);
                movieData(searchList);

                console.log(searchList);
            };
        };

        $searchBtn.addEventListener('click', performSearch);
        $searchInput.addEventListener('keydown', function (event) {   // 검색창에 검색어를 입력 후 'Enter' 키를 누르면 검색이 되게끔 (feat. Chat GPT)
            if (event.key === 'Enter') {
                performSearch();
            };
        });

        // 4) 특정 버튼 클릭 시 초기 화면으로 돌아오기  // 저는 전체목록 가는 버튼을 만들어 '새로고침' 해주었습니다. 
        $refreshBtn.addEventListener('click', function () {
            location.reload();
        });

    })
    .catch(err => console.error(err));



// // 상단 search 나오게
// window.addEventListener("scroll", function () {
//     const hederSearch = document.querySelector(".headSearch");

//     // 현재 내 스크롤 위치
//     let scrollPosition = window.scrollY || document.documentElement.scrollTop;

//     if (scrollPosition >= 100) {
//         // 현재 내 스크롤 위치가 100 초과 시
//         hederSearch.style.paddingTop = '20px';
//     } else {
//         // 현재 내 스크롤 위치가 100 미만 시
//         hederSearch.style.paddingTop = '0';

//     }
// });