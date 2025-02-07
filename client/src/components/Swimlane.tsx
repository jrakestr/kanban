// Parameter: Authorization
// Format: Bearer ${token}

import { Box, Heading, VStack, useColorModeValue } from "@chakra-ui/react";
import TicketCard from "./TicketCard";
import { useDrop } from "react-dnd";
import { TicketData } from "../interfaces/TicketData";

interface SwimlaneProps {
	title: string;
	tickets: TicketData[];
	deleteTicket: (id: number) => Promise<any>;
	onDrop: (id: number, status: string) => void;
}

const Swimlane = ({ title, tickets, deleteTicket, onDrop }: SwimlaneProps) => {
	const [{ isOver }, drop] = useDrop({
		accept: "TICKET",
		drop: (item: TicketData) => {
			if (item.id !== null) {
				onDrop(item.id, title);
			}
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
		canDrop: (item: TicketData) => item.status !== title,
	});

	// Use Chakra's color mode values for the lane background
	const laneBg = useColorModeValue("gray.50", "gray.700");
	const laneBorder = isOver ? "blue.400" : "gray.200";

	return (
		<Box
			ref={drop}
			flex="1"
			minW="300px"
			p={4}
			bg={laneBg}
			borderRadius="lg"
			borderWidth="1px"
			borderColor={laneBorder}
			transition="all 0.2s"
			_hover={{
				transform: "translateY(-2px)",
			}}
		>
			<Heading size="md" mb={4} textAlign="center">
				{title}
			</Heading>
			<VStack spacing={4} align="stretch">
				{tickets.map((ticket) => (
					<TicketCard
						key={ticket.id}
						ticket={ticket}
						deleteTicket={deleteTicket}
					/>
				))}
			</VStack>
		</Box>
	);
};

export default Swimlane;
