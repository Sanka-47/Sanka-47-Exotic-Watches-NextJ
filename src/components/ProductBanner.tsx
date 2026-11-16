import Image from 'next/image';
import { Box, Typography, Button } from '@mui/material';

interface ProductBannerProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    quantity: number;
    imageUrl: string;
    imageUrl_2: string;
    imageUrl_3: string;
    status: string;
  };
}

export default function ProductBanner({ product }: ProductBannerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column-reverse', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 3, md: 5 },
        py: { xs: 4, md: 6 },
        background: 'linear-gradient(135deg, #f5f5f5, #ffffff)',
        borderRadius: '12px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Text Section */}
      <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h4" fontWeight={600} color="text.primary" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3} sx={{ maxWidth: '500px' }}>
          {product.description}
        </Typography>
        
      </Box>

      {/* Image Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          src={product.imageUrl_3}
          alt={product.name}
          width={400}
          height={300}
          priority
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        />
      </Box>
    </Box>
  );
}
