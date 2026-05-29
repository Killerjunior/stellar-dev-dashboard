import React, { useState } from 'react'
import { getAllTemplates } from '../../lib/templateManager'
import { getContractTemplates, downloadScaffold } from '../../lib/contractDevelopment'
import TemplateCard from './TemplateCard'
import TemplateDeployer from './TemplateDeployer'

const CATEGORIES = ['all', 'token', 'escrow', 'governance', 'nft', 'scaffold']

export default function TemplateLibrary() {
  const templates = getAllTemplates()
  const contractTemplates = getContractTemplates()
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [scaffoldDownloaded, setScaffoldDownloaded] = useState(null)

  const filtered = filter === 'all'
    ? templates
    : filter === 'scaffold'
      ? [] // Scaffold section is separate
      : templates.filter((t) => t.category === filter)

  const handleScaffoldDownload = (templateId) => {
    try {
      const bundle = downloadScaffold(templateId)
      setScaffoldDownloaded(templateId)
      setTimeout(() => setScaffoldDownloaded(null), 2000)
    } catch (err) {
      console.error('Scaffold download failed:', err)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Category filter */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: '5px 12px',
              background: filter === cat ? 'var(--cyan-glow)' : 'transparent',
              border: `1px solid ${filter === cat ? 'var(--cyan-dim)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)',
              color: filter === cat ? 'var(--cyan)' : 'var(--text-secondary)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      {(filter !== 'scaffold') && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '12px',
        }}>
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              selected={selected?.id === template.id}
              onSelect={setSelected}
            />
          ))}
        </div>
      )}

      {/* Scaffold Section */}
      {(filter === 'all' || filter === 'scaffold') && (
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          backgroundColor: 'var(--surface)',
        }}>
          <h3 style={{
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--cyan)',
            margin: '0 0 12px 0',
          }}>
            📦 Contract Scaffolds
          </h3>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            margin: '0 0 16px 0',
          }}>
            Download starter spec + README for token, escrow, and oracle patterns.
            Real contracts require a full Rust build with Soroban SDK.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '10px',
          }}>
            {contractTemplates.map((template) => (
              <div
                key={template.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--text)' }}>
                  {template.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', flex: 1 }}>
                  {template.description}
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '9px',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--surface-hover)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleScaffoldDownload(template.id)}
                  style={{
                    padding: '6px 12px',
                    background: scaffoldDownloaded === template.id ? 'var(--cyan-glow)' : 'transparent',
                    border: `1px solid ${scaffoldDownloaded === template.id ? 'var(--cyan)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    color: scaffoldDownloaded === template.id ? 'var(--cyan)' : 'var(--text-secondary)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {scaffoldDownloaded === template.id ? '✓ Downloaded' : 'Download Scaffold'}
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '12px', fontSize: '10px', color: 'var(--text-secondary)' }}>
            <a
              href="https://developers.stellar.org/docs/smart-contracts"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--cyan)', textDecoration: 'none' }}
            >
              📖 Stellar Smart Contract Docs →
            </a>
          </div>
        </div>
      )}

      {/* Deployer panel */}
      {selected && (
        <TemplateDeployer
          template={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}