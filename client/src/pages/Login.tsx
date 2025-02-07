import {
  Grid,
  GridItem,
  Box,
  Input,
  Button,
  Text,
  Heading,
  useToast,
  Image,
  keyframes,
  VStack,
  HStack
} from '@chakra-ui/react';
import { useState, FormEvent } from 'react';
import Auth from '../utils/auth';
import { login } from '../api/authAPI';
import kanbanLogo from '../assets/kanban.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      Auth.login(response.token);
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: 'Error',
        description: 'Failed to login. Please check your credentials.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  `;

  return (
    <Grid
      templateColumns={{ base: '1fr', md: '1fr 1fr' }}
      h="100vh"
      m={0}
      p={0}
    >
      {/* Left side - Animated Background */}
      <GridItem
        bg="blue.600"
        position="relative"
        overflow="hidden"
        display={{ base: 'none', md: 'block' }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="linear(to-br, blue.400, blue.600)"
          opacity={0.9}
        />
        <VStack
          position="relative"
          h="full"
          justify="center"
          spacing={8}
          p={10}
        >
          <Image
            src={kanbanLogo}
            alt="Kanban Logo"
            w="300px"
            animation={`${float} 3s ease-in-out infinite`}
          />
          <Heading
            color="white"
            size="2xl"
            textAlign="center"
            textShadow="2px 2px 4px rgba(0,0,0,0.2)"
          >
            Welcome to Kanban
          </Heading>
          <Text
            color="whiteAlpha.900"
            fontSize="xl"
            textAlign="center"
            maxW="500px"
          >
            Organize your tasks, streamline your workflow, and boost your productivity
          </Text>
        </VStack>
      </GridItem>

      {/* Right side - Login Form */}
      <GridItem
        bg="gray.50"
        p={{ base: 8, md: 20 }}
      >
        <VStack
          spacing={8}
          w="full"
          h="full"
          justify="center"
        >
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={3} w="full" align="flex-start">
            <Heading size="xl" color="gray.700">
              Sign In
            </Heading>
            <Text color="gray.500">
              Enter your credentials to access your account
            </Text>
          </VStack>

          <VStack spacing={6} w="full">
            <Box w="full">
              <Text mb={2} fontWeight="medium">Username</Text>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                size="lg"
                bg="white"
                borderWidth={2}
                _focus={{
                  borderColor: 'blue.400',
                  boxShadow: 'none'
                }}
              />
            </Box>

            <Box w="full">
              <Text mb={2} fontWeight="medium">Password</Text>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                size="lg"
                bg="white"
                borderWidth={2}
                _focus={{
                  borderColor: 'blue.400',
                  boxShadow: 'none'
                }}
              />
            </Box>

            <Button
              type="submit"
              size="lg"
              w="full"
              bg="blue.600"
              color="white"
              _hover={{
                bg: 'blue.700',
                transform: 'translateY(-2px)',
                boxShadow: 'lg'
              }}
              _active={{
                bg: 'blue.800',
                transform: 'translateY(0)'
              }}
              transition="all 0.2s"
              fontSize="lg"
              h={14}
            >
              Sign In
            </Button>
          </VStack>

          <HStack spacing={2} color="gray.500">
            <Text>Don't have an account?</Text>
            <Text color="blue.600" cursor="pointer" _hover={{ textDecoration: 'underline' }}>
              Sign up
            </Text>
          </HStack>
          </form>
        </VStack>
      </GridItem>
    </Grid>
  );
}