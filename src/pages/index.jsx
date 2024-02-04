import { Inter } from 'next/font/google'
import { Header } from '@component';

const inter = Inter({ subsets: ['latin'] });


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