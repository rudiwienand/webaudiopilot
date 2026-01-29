import { 
  RootSymbol, 
  SacralSymbol, 
  SolarPlexusSymbol, 
  HeartSymbol, 
  ThroatSymbol, 
  ThirdEyeSymbol, 
  CrownSymbol 
} from './ChakraSymbols';

interface Chakra {
  id: number;
  name: string;
  sanskrit: string;
  color: string;
  gradient: string;
}

interface ChakraSelectorProps {
  selectedChakra: number;
  onSelectChakra: (id: number) => void;
}

export function ChakraSelector({ selectedChakra, onSelectChakra }: ChakraSelectorProps) {
  const chakras: Chakra[] = [
    {
      id: 1,
      name: "Root Chakra",
      sanskrit: "Muladhara",
      color: "#C72542",
      gradient: "from-red-600 to-red-700"
    },
    {
      id: 2,
      name: "Sacral Chakra",
      sanskrit: "Svadhisthana",
      color: "#E36414",
      gradient: "from-orange-600 to-orange-700"
    },
    {
      id: 3,
      name: "Solar Plexus Chakra",
      sanskrit: "Manipura",
      color: "#D4C922",
      gradient: "from-yellow-500 to-yellow-600"
    },
    {
      id: 4,
      name: "Heart Chakra",
      sanskrit: "Anahata",
      color: "#1ABC9C",
      gradient: "from-green-600 to-green-700"
    },
    {
      id: 5,
      name: "Throat Chakra",
      sanskrit: "Vishuddha",
      color: "#2196F3",
      gradient: "from-blue-600 to-blue-700"
    },
    {
      id: 6,
      name: "Third Eye Chakra",
      sanskrit: "Ajna",
      color: "#FFB347",
      gradient: "from-indigo-600 to-indigo-700"
    },
    {
      id: 7,
      name: "Crown Chakra",
      sanskrit: "Sahasrara",
      color: "#9C27B0",
      gradient: "from-purple-600 to-purple-700"
    }
  ];

  const getChakraSymbol = (id: number, color: string, isSelected: boolean) => {
    const symbolProps = { color, isSelected };
    switch (id) {
      case 1: return <RootSymbol {...symbolProps} />;
      case 2: return <SacralSymbol {...symbolProps} />;
      case 3: return <SolarPlexusSymbol {...symbolProps} />;
      case 4: return <HeartSymbol {...symbolProps} />;
      case 5: return <ThroatSymbol {...symbolProps} />;
      case 6: return <ThirdEyeSymbol {...symbolProps} />;
      case 7: return <CrownSymbol {...symbolProps} />;
      default: return null;
    }
  };

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 md:p-6">
      <h2 className="text-white/90 mb-4 md:mb-6 text-center">Select Chakra</h2>
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-5xl">
          {chakras.map((chakra) => (
            <button
              key={chakra.id}
              onClick={() => onSelectChakra(chakra.id)}
              className={`
                relative p-3 md:p-4 rounded-xl transition-all duration-300
                w-[calc(50%-0.25rem)] sm:w-auto
                ${selectedChakra === chakra.id 
                  ? 'shadow-lg scale-105 ring-2 ring-white/30' 
                  : 'hover:scale-102 opacity-80 hover:opacity-100'
                }
              `}
              style={{
                backgroundColor: selectedChakra === chakra.id 
                  ? `${chakra.color}CC` 
                  : `${chakra.color}40`,
                boxShadow: selectedChakra === chakra.id 
                  ? `0 0 20px ${chakra.color}80, 0 4px 6px -1px rgb(0 0 0 / 0.3)` 
                  : 'none'
              }}
            >
              <div 
                className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2"
                style={{ 
                  filter: selectedChakra === chakra.id ? `drop-shadow(0 0 12px ${chakra.color}FF)` : 'none'
                }}
              >
                {getChakraSymbol(chakra.id, chakra.color, selectedChakra === chakra.id)}
              </div>
              <div className="text-center">
                <p className="text-white/90 text-xs md:text-sm font-medium whitespace-nowrap">{chakra.name}</p>
                <p className="text-white/60 text-[10px] md:text-xs mt-1">{chakra.sanskrit}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}