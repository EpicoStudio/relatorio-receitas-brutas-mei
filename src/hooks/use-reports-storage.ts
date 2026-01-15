import { useState, useEffect, useCallback } from "react"

export interface DadosRelatorio {
  comercioSemDoc: string
  comercioComDoc: string
  industriaSemDoc: string
  industriaComDoc: string
  servicosSemDoc: string
  servicosComDoc: string
  dataAssinatura: string
}

export interface PerfilUsuario {
  cnpj: string
  nome: string
  local: string
}

interface StoredData {
  perfil: PerfilUsuario
  relatorios: Record<string, DadosRelatorio> // key: "yyyy-MM"
}

// Range fixo de anos: 2020 até ano atual + 1
const ANO_INICIAL = 2020
function getAnosDisponiveis(): number[] {
  const anoFinal = new Date().getFullYear() + 1
  const anos: number[] = []
  for (let ano = ANO_INICIAL; ano <= anoFinal; ano++) {
    anos.push(ano)
  }
  return anos
}

const STORAGE_KEY = "relatorio-mei-data"

const defaultPerfil: PerfilUsuario = {
  cnpj: "",
  nome: "",
  local: "",
}

const defaultRelatorio: DadosRelatorio = {
  comercioSemDoc: "0.00",
  comercioComDoc: "0.00",
  industriaSemDoc: "0.00",
  industriaComDoc: "0.00",
  servicosSemDoc: "0.00",
  servicosComDoc: "0.00",
  dataAssinatura: "",
}

function loadFromStorage(): StoredData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored) as StoredData
      return {
        perfil: data.perfil || defaultPerfil,
        relatorios: data.relatorios || {},
      }
    }
  } catch (e) {
    console.error("Error loading from localStorage:", e)
  }
  return {
    perfil: defaultPerfil,
    relatorios: {},
  }
}

function saveToStorage(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error("Error saving to localStorage:", e)
  }
}

export function useReportsStorage() {
  const [data, setData] = useState<StoredData>(loadFromStorage)
  const [periodoAtual, setPeriodoAtual] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(data)
  }, [data])

  const getPerfil = useCallback((): PerfilUsuario => {
    return data.perfil
  }, [data.perfil])

  const setPerfil = useCallback((perfil: Partial<PerfilUsuario>): void => {
    setData((prev) => ({
      ...prev,
      perfil: { ...prev.perfil, ...perfil },
    }))
  }, [])

  const getRelatorio = useCallback(
    (periodo: string): DadosRelatorio => {
      return data.relatorios[periodo] || defaultRelatorio
    },
    [data.relatorios]
  )

  const setRelatorio = useCallback(
    (periodo: string, relatorio: Partial<DadosRelatorio>): void => {
      setData((prev) => ({
        ...prev,
        relatorios: {
          ...prev.relatorios,
          [periodo]: { ...defaultRelatorio, ...prev.relatorios[periodo], ...relatorio },
        },
      }))
    },
    []
  )

  const temDadosSalvos = useCallback(
    (periodo: string): boolean => {
      const rel = data.relatorios[periodo]
      if (!rel) return false
      // Check if any revenue field has non-zero value
      return (
        parseFloat(rel.comercioSemDoc || "0") > 0 ||
        parseFloat(rel.comercioComDoc || "0") > 0 ||
        parseFloat(rel.industriaSemDoc || "0") > 0 ||
        parseFloat(rel.industriaComDoc || "0") > 0 ||
        parseFloat(rel.servicosSemDoc || "0") > 0 ||
        parseFloat(rel.servicosComDoc || "0") > 0
      )
    },
    [data.relatorios]
  )

  // Retorna range fixo de anos (2020 até ano atual + 1)
  const getAnos = useCallback((): number[] => {
    return getAnosDisponiveis()
  }, [])

  const limparRelatorio = useCallback((periodo: string): void => {
    setData((prev) => {
      const newRelatorios = { ...prev.relatorios }
      delete newRelatorios[periodo]
      return {
        ...prev,
        relatorios: newRelatorios,
      }
    })
  }, [])

  // Limpa todos os relatórios de um ano (mas mantém o ano visível)
  const limparAno = useCallback((ano: number): void => {
    setData((prev) => {
      const newRelatorios = { ...prev.relatorios }
      Object.keys(newRelatorios).forEach((periodo) => {
        const [anoRel] = periodo.split("-")
        if (parseInt(anoRel) === ano) {
          delete newRelatorios[periodo]
        }
      })
      return {
        ...prev,
        relatorios: newRelatorios,
      }
    })
  }, [])

  // Retorna todos os relatórios que têm dados preenchidos, ordenados por período
  const getTodosRelatorios = useCallback((): Array<{ periodo: string; relatorio: DadosRelatorio }> => {
    return Object.entries(data.relatorios)
      .filter(([periodo]) => temDadosSalvos(periodo))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([periodo, relatorio]) => ({ periodo, relatorio }))
  }, [data.relatorios, temDadosSalvos])

  const getMesesComDados = useCallback(
    (ano: number): string[] => {
      return Object.keys(data.relatorios).filter((periodo) => {
        const [anoRel] = periodo.split("-")
        return parseInt(anoRel) === ano && temDadosSalvos(periodo)
      })
    },
    [data.relatorios, temDadosSalvos]
  )

  return {
    periodoAtual,
    setPeriodoAtual,
    getPerfil,
    setPerfil,
    getRelatorio,
    setRelatorio,
    temDadosSalvos,
    getAnos,
    limparRelatorio,
    limparAno,
    getTodosRelatorios,
    getMesesComDados,
  }
}
