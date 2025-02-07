import { Stack, Flex, Button, Text, VStack, useBreakpointValue } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import kanbanLogo from '../assets/kanban.png';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <Flex
      w={'full'}
      h={'100vh'}
      backgroundImage={`url(${kanbanLogo})`}
      backgroundSize={'contain'}
      backgroundRepeat={'no-repeat'}
      bgColor={'gray.50'}
      backgroundPosition={'center center'}
      sx={{ filter: 'blur(1px)' }}>
      <VStack
        w={'full'}
        justify={'center'}
        px={useBreakpointValue({ base: 4, md: 8 })}
        bgGradient={'linear(to-r, whiteAlpha.800, whiteAlpha.500)'}>
        <Stack
          maxW={'2xl'}
          align={'center'}
          spacing={6}
          position={'relative'}
          _before={{
            content: '""',
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40%',
            height: '2px',
            background: 'linear-gradient(to right, transparent, gray.300, transparent)',
          }}
          _after={{
            content: '""',
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40%',
            height: '2px',
            background: 'linear-gradient(to right, transparent, gray.300, transparent)',
          }}>

          <Text
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            fontWeight={'bold'}
            textAlign={'center'}
            color={'gray.800'}
            letterSpacing={'wide'}
            textShadow={'0 2px 4px rgba(0,0,0,0.1)'}>

            Organize your tasks with Kanban Board
          </Text>
          <Text
            fontSize={{ base: 'md', lg: 'lg' }}
            color={'gray.600'}
            textAlign={'center'}
            fontWeight={'bold'}
            letterSpacing={'tight'}
            textShadow={'0 1px 2px rgba(0,0,0,0.1)'}>

            Streamline your workflow with our intuitive Kanban board. Track your progress,
            manage tasks efficiently, and boost your productivity.
          </Text>
          <Button
            rounded={'full'}
            bg={'blue.400'}
            color={'white'}
            _hover={{ bg: 'blue.500' }}
            onClick={() => navigate('/login')}>
            Login
          </Button>
        </Stack>
      </VStack>
      <Text
        position={'absolute'}
        bottom={4}
        fontSize={'sm'}
        color={'gray.600'}
        fontFamily={'monospace'}
        _hover={{ color: 'blue.400' }}>
        {'< crafted with 💻 by '}
        <a href="https://github.com/jrakestr" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          @jrakestr
        </a>
        {' />'}  
      </Text>
    </Flex>
  );
}
