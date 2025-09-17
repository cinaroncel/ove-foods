'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Users, ChefHat } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Recipe } from '@/lib/cms/types'
import { cardHover } from '@/lib/motion/constants'
import { getRecipeImageUrl } from '@/lib/utils/image-utils'

interface RecipeCardProps {
  recipe: Recipe
  className?: string
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  const totalTime = recipe.times.prep + recipe.times.cook
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={cardHover}
      className={className}
    >
      <Card className="h-full overflow-hidden group flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
          <Link href={`/recipes/${recipe.slug}`} className="block">
            {/* Use regular img tag for external images to avoid Next.js Image restrictions */}
            {recipe.heroImage?.startsWith('http') ? (
              <img
                src={recipe.heroImage}
                alt={recipe.title}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <Image
                src={getRecipeImageUrl(recipe.heroImage)}
                alt={recipe.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </Link>
          
          {/* Difficulty badge */}
          <div className="absolute top-2 right-2">
            <Badge 
              className={`${getDifficultyColor(recipe.difficulty)} border-0 capitalize`}
            >
              {recipe.difficulty}
            </Badge>
          </div>
          
          {/* Featured badge */}
          {recipe.featured && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-brand-primary text-white">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3 flex-grow flex flex-col">
          <div>
            <h3 className="font-semibold text-lg leading-tight mb-2">
              <Link 
                href={`/recipes/${recipe.slug}`}
                className="hover:text-primary transition-colors focus-visible-ring"
              >
                {recipe.title}
              </Link>
            </h3>
            
            <div className="h-[2.5rem] flex items-start">
              <p className="text-sm text-muted-foreground line-clamp-2 leading-5">
                {recipe.description || ' '}
              </p>
            </div>
          </div>
          
          {/* Recipe meta */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="h-4 w-4" />
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="h-6 flex flex-wrap gap-1 mt-auto">
            {recipe.tags.length > 0 ? (
              <>
                {recipe.tags.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs capitalize"
                  >
                    {tag}
                  </Badge>
                ))}
                {recipe.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{recipe.tags.length - 3}
                  </Badge>
                )}
              </>
            ) : (
              <div></div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex-shrink-0">
          <Button asChild className="w-full">
            <Link href={`/recipes/${recipe.slug}`}>
              View Recipe
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
