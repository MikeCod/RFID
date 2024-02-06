import { Header } from '@component';

export { getServerSideProps } from "@sutils";


export default function Home() {
	return (
		<div>
			<Header>
				<a href="#home">Home</a>
				<a href="#offers">Offers</a>
				<a href="#FAQ">FAQ</a>
				<a href="#Reviews">Reviews</a>
			</Header>
		</div>
	)
}