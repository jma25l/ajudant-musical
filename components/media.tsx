
interface YoutubeVideoParams {
    v: string;
}
export function YoutubeVideo(params: YoutubeVideoParams) {
    const { v } = params;
    return (
        <iframe src={"https://www.youtube.com/embed/"+v} 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen></iframe>
    );

}