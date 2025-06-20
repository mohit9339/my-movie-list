import { useParams } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();

  return <h1>🎬 Movie Details Page for ID: {id}</h1>;
}
export default MovieDetails;
