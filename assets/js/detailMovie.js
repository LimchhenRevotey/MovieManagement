// Detail Movie 
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
detailMovie(id);
function detailMovie(id) {
    fetch(`https://69f2cbc1b15130b9735329a9.mockapi.io/api/movies/${id}`,{
        method: 'GET'
    })
        .then(response => response.json())
        .then(detailMovie => {
            console.log(detailMovie);
            const detailData = `
                <button class=" back-btn btn btn-warning fw-bold" onclick="goBack()"><i class="bi bi-chevron-left me-2"></i>Back</button>
                <div class="detail-header-img" style="background-image: url('${detailMovie.poster}'); position: relative; height: 400px; background-size: cover; background-position: center;">
                    <div style="position:absolute; bottom:0; left:0; width:100%; height:100%; background:linear-gradient(0deg, var(--bg-body), transparent)"></div>
                </div>
                <div class="container py-5">
                    <div class="row">
                        <div class="col-md-8">
                            <h1 class="display-1 fw-bold" style="font-family:'Bebas Neue'">${detailMovie.title}</h1>
                            <div class="d-flex gap-3 mb-4 opacity-75">
                                <span class="text-warning fw-bold">${detailMovie.rating} Rating</span>
                                <span>${detailMovie.releaseDate}</span>
                            </div>
                            <h4 class="mb-3">${detailMovie.genre}</h4>
                            <p class="fs-5 opacity-75 lh-lg">${detailMovie.description}</p>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('detailContent').innerHTML = detailData;
        });
}

// Go back
function goBack () {
    window.history.back();
}