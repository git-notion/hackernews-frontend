const sentinel = document.getElementById("sentinel");

const observer = new IntersectionObserver((entries) => {
    console.log(entries[0].isIntersecting);

    if (entries[0].isIntersecting) {
        console.log("Loading next batch");
        loadNextBatch();
    }
});
observer.observe(sentinel)